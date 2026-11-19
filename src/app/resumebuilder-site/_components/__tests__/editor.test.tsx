import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryStore } from '../../_lib/db';
import { newResumeDoc } from '../../_lib/defaults';
import { Editor } from '../editor/Editor';
import { Workspace } from '../Workspace';

describe('Editor', () => {
  it('edits the name and reflects it in the live preview and the store', async () => {
    const store = new MemoryStore();
    const doc = newResumeDoc();
    await store.putResume(doc);
    const user = userEvent.setup();
    render(<Editor initialDoc={doc} store={store} onBack={() => undefined} onDocSaved={() => undefined} />);
    const nameInput = screen.getByLabelText(/Full name/);
    await user.type(nameInput, 'Ayesha Khan');
    await waitFor(() => {
      expect(screen.getByTestId('template-view')).toHaveTextContent('Ayesha Khan');
    });
    // Debounced autosave persists to the store.
    await waitFor(
      async () => {
        const saved = await store.getResume(doc.id);
        expect(saved?.basics.name).toBe('Ayesha Khan');
      },
      { timeout: 3000 },
    );
  });

  it('adds a section from the add-section menu', async () => {
    const store = new MemoryStore();
    const doc = newResumeDoc();
    const user = userEvent.setup();
    render(<Editor initialDoc={doc} store={store} onBack={() => undefined} onDocSaved={() => undefined} />);
    const select = document.getElementById('add-section-select') as HTMLSelectElement;
    await user.selectOptions(select, 'languages');
    const addButtons = screen.getAllByRole('button', { name: /^Add$/ });
    await user.click(addButtons[addButtons.length - 1]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Languages' })).toBeTruthy();
    });
  });

  it('guided mode walks steps with progress and can exit', async () => {
    const store = new MemoryStore();
    const doc = newResumeDoc();
    const user = userEvent.setup();
    render(<Editor initialDoc={doc} store={store} onBack={() => undefined} onDocSaved={() => undefined} />);
    await user.click(screen.getByRole('button', { name: /Guided mode/ }));
    expect(screen.getByText(/step 1 of 8/)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Skip \/ Next/ }));
    expect(screen.getByText(/step 2 of 8/)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Exit guided mode/ }));
    expect(screen.queryByText(/step 2 of 8/)).toBeNull();
  });
});

describe('Workspace', () => {
  it('creates a first resume from the empty state and opens the editor', async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    const create = await screen.findByRole('button', { name: /Create a resume/ });
    await user.click(create);
    await waitFor(() => {
      expect(screen.getByLabelText(/Full name/)).toBeTruthy();
    });
  });
});
