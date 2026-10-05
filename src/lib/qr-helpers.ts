import type { QRType, QRData, QRTypeConfig, ECLevel } from '@/types';

export const qrTypeConfigs: QRTypeConfig[] = [
  { type: 'text', label: 'Plain Text', icon: 'Type', description: 'Encode any plain text message', category: 'utilities', fields: [{ name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Enter your text here...', required: true, rows: 4 }] },
  { type: 'url', label: 'Website URL', icon: 'Globe', description: 'Link to any website', category: 'popular', fields: [{ name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com', required: true }] },
  { type: 'pdf', label: 'PDF File', icon: 'FileText', description: 'Link to a PDF document', category: 'business', fields: [{ name: 'url', label: 'PDF URL', type: 'url', placeholder: 'https://example.com/document.pdf', required: true }] },
  { type: 'audio', label: 'Audio File', icon: 'Music', description: 'Link to an audio file or podcast', category: 'utilities', fields: [{ name: 'url', label: 'Audio URL', type: 'url', placeholder: 'https://example.com/audio.mp3', required: true }] },
  { type: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', description: 'Send a WhatsApp message to a number', category: 'popular', fields: [{ name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true }, { name: 'message', label: 'Pre-filled Message', type: 'textarea', placeholder: 'Hello, I would like to...', required: false, rows: 2 }] },
  { type: 'phone', label: 'Phone Call', icon: 'Phone', description: 'Initiate a phone call', category: 'popular', fields: [{ name: 'number', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true }] },
  { type: 'sms', label: 'SMS', icon: 'MessageSquare', description: 'Send an SMS message', category: 'popular', fields: [{ name: 'number', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true }, { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message here...', required: false, rows: 2 }] },
  { type: 'email', label: 'Email', icon: 'Mail', description: 'Send an email with pre-filled fields', category: 'popular', fields: [{ name: 'email', label: 'Email Address', type: 'email', placeholder: 'someone@example.com', required: true }, { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Subject line...', required: false }, { name: 'body', label: 'Message Body', type: 'textarea', placeholder: 'Your message...', required: false, rows: 3 }] },
  { type: 'address', label: 'Address', icon: 'MapPin', description: 'Show a location on Google Maps', category: 'utilities', fields: [{ name: 'address', label: 'Physical Address', type: 'textarea', placeholder: '123 Main St, City, Country', required: true, rows: 2 }] },
  { type: 'wifi', label: 'WiFi', icon: 'Wifi', description: 'Connect to a WiFi network automatically', category: 'popular', fields: [{ name: 'ssid', label: 'Network Name (SSID)', type: 'text', placeholder: 'MyWiFiNetwork', required: true }, { name: 'password', label: 'Password', type: 'text', placeholder: 'wifipassword', required: false }, { name: 'encryption', label: 'Encryption', type: 'select', placeholder: '', required: true, options: [{ label: 'WPA/WPA2', value: 'WPA' }, { label: 'WEP', value: 'WEP' }, { label: 'None', value: 'nopass' }] }] },
  { type: 'vcard', label: 'vCard', icon: 'User', description: 'Share contact information', category: 'popular', fields: [{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true }, { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: false }, { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', required: false }, { name: 'org', label: 'Organisation', type: 'text', placeholder: 'Company Inc.', required: false }] },
  { type: 'social', label: 'Social Media', icon: 'Share2', description: 'Link to a social media profile', category: 'social', fields: [{ name: 'platform', label: 'Platform', type: 'select', required: true, options: [{ label: 'Twitter / X', value: 'twitter' }, { label: 'Instagram', value: 'instagram' }, { label: 'Facebook', value: 'facebook' }, { label: 'LinkedIn', value: 'linkedin' }, { label: 'TikTok', value: 'tiktok' }] }, { name: 'username', label: 'Username', type: 'text', placeholder: '@username or profile URL', required: true }] },
  { type: 'video', label: 'Video', icon: 'Video', description: 'Link to a video file or platform', category: 'utilities', fields: [{ name: 'url', label: 'Video URL', type: 'url', placeholder: 'https://youtube.com/watch?v=...', required: true }] },
  { type: 'image', label: 'Image', icon: 'Image', description: 'Link to an image file', category: 'utilities', fields: [{ name: 'url', label: 'Image URL', type: 'url', placeholder: 'https://example.com/image.jpg', required: true }] },
  { type: 'menu', label: 'Menu', icon: 'UtensilsCrossed', description: 'Link to a restaurant menu or display items', category: 'business', fields: [{ name: 'title', label: 'Restaurant Name', type: 'text', placeholder: 'My Restaurant', required: true }, { name: 'url', label: 'Menu URL (optional)', type: 'url', placeholder: 'https://example.com/menu', required: false }, { name: 'items', label: 'Menu Items', type: 'textarea', placeholder: 'Item 1 - $10\nItem 2 - $15\n...', required: false, rows: 4 }] },
  { type: 'app', label: 'App Download', icon: 'Smartphone', description: 'Link to app stores', category: 'business', fields: [{ name: 'platform', label: 'Platform', type: 'select', required: true, options: [{ label: 'App Store (iOS)', value: 'ios' }, { label: 'Google Play (Android)', value: 'android' }, { label: 'Both', value: 'both' }] }, { name: 'iosUrl', label: 'App Store URL', type: 'url', placeholder: 'https://apps.apple.com/app/...', required: false }, { name: 'androidUrl', label: 'Google Play URL', type: 'url', placeholder: 'https://play.google.com/store/apps/...', required: false }] },
  { type: 'coupon', label: 'Coupon', icon: 'TicketPercent', description: 'Share a discount coupon', category: 'business', fields: [{ name: 'code', label: 'Coupon Code', type: 'text', placeholder: 'SAVE20', required: true }, { name: 'description', label: 'Description', type: 'textarea', placeholder: '20% off your next purchase!', required: false, rows: 2 }, { name: 'url', label: 'Store URL (optional)', type: 'url', placeholder: 'https://example.com/shop', required: false }] },
  { type: 'event', label: 'Event', icon: 'Calendar', description: 'Create a calendar event', category: 'business', fields: [{ name: 'title', label: 'Event Name', type: 'text', placeholder: 'My Awesome Event', required: true }, { name: 'date', label: 'Date', type: 'date', placeholder: '', required: true }, { name: 'time', label: 'Time', type: 'time', placeholder: '', required: false }, { name: 'location', label: 'Location', type: 'text', placeholder: '123 Event St, City', required: false }, { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Event details...', required: false, rows: 2 }] },
  { type: 'business_card', label: 'Business Card', icon: 'Briefcase', description: 'Enhanced business card with all details', category: 'business', fields: [{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true }, { name: 'title', label: 'Job Title', type: 'text', placeholder: 'Software Engineer', required: false }, { name: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp', required: false }, { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1234567890', required: false }, { name: 'email', label: 'Email', type: 'email', placeholder: 'john@techcorp.com', required: false }, { name: 'website', label: 'Website', type: 'url', placeholder: 'https://techcorp.com', required: false }, { name: 'address', label: 'Address', type: 'textarea', placeholder: '123 Business St, City', required: false, rows: 2 }] },
  { type: 'freelance', label: 'Freelance', icon: 'Code', description: 'Share your portfolio or freelance profile', category: 'business', fields: [{ name: 'name', label: 'Your Name', type: 'text', placeholder: 'Jane Designer', required: true }, { name: 'skill', label: 'Primary Skill', type: 'text', placeholder: 'UI/UX Designer', required: false }, { name: 'portfolio', label: 'Portfolio URL', type: 'url', placeholder: 'https://myportfolio.com', required: true }, { name: 'email', label: 'Contact Email', type: 'email', placeholder: 'hello@myportfolio.com', required: false }] },
  { type: 'ecommerce', label: 'E-Commerce', icon: 'ShoppingCart', description: 'Link to a product or store', category: 'business', fields: [{ name: 'productName', label: 'Product Name', type: 'text', placeholder: 'Awesome Product', required: true }, { name: 'url', label: 'Product URL', type: 'url', placeholder: 'https://store.com/product/123', required: true }, { name: 'price', label: 'Price', type: 'text', placeholder: '$29.99', required: false }] },
  { type: 'cleaning', label: 'Cleaning Service', icon: 'Sparkles', description: 'Booking link for cleaning services', category: 'business', fields: [{ name: 'company', label: 'Company Name', type: 'text', placeholder: 'Sparkle Clean', required: true }, { name: 'url', label: 'Booking URL', type: 'url', placeholder: 'https://sparkleclean.com/book', required: true }, { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: false }] },
  { type: 'logistics', label: 'Logistics', icon: 'Truck', description: 'Package tracking link', category: 'utilities', fields: [{ name: 'trackingNumber', label: 'Tracking Number', type: 'text', placeholder: 'TRACK123456', required: true }, { name: 'url', label: 'Tracking URL', type: 'url', placeholder: 'https://logistics.com/track?id=...', required: true }] },
  { type: 'finance', label: 'Finance', icon: 'Landmark', description: 'Payment or financial service link', category: 'payments', fields: [{ name: 'service', label: 'Service Name', type: 'text', placeholder: 'PayMe / Transfer', required: true }, { name: 'url', label: 'Payment URL', type: 'url', placeholder: 'https://pay.example.com/send', required: true }, { name: 'account', label: 'Account/Handle', type: 'text', placeholder: '@username or account ID', required: false }] },
  { type: 'cv', label: 'CV / Resume', icon: 'FileBadge', description: 'Link to your CV or resume PDF', category: 'utilities', fields: [{ name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe', required: true }, { name: 'url', label: 'CV PDF URL', type: 'url', placeholder: 'https://example.com/my-cv.pdf', required: true }, { name: 'title', label: 'Professional Title', type: 'text', placeholder: 'Senior Developer', required: false }] },
  { type: 'mecard', label: 'MeCard', icon: 'ContactRound', description: 'MeCard contact format (compact vCard)', category: 'utilities', fields: [{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'Yamada Taro', required: true }, { name: 'tel', label: 'Phone', type: 'tel', placeholder: '+81...' }, { name: 'email', label: 'Email', type: 'email', placeholder: 'yamada@example.com' }, { name: 'url', label: 'Website', type: 'url', placeholder: 'https://example.com' }, { name: 'address', label: 'Address', type: 'text', placeholder: '1-2-3 Shibuya Tokyo' }, { name: 'nickname', label: 'Nickname', type: 'text' }, { name: 'birthday', label: 'Birthday (YYYYMMDD)', type: 'text', placeholder: '19900101' }] },
  { type: 'geo', label: 'Geo Location', icon: 'Navigation', description: 'GPS coordinates or Google Maps pin', category: 'utilities', fields: [{ name: 'lat', label: 'Latitude', type: 'text', placeholder: '35.6762', required: true }, { name: 'lng', label: 'Longitude', type: 'text', placeholder: '139.6503', required: true }] },
  { type: 'telegram', label: 'Telegram', icon: 'Send', description: 'Open a Telegram chat or channel', category: 'social', fields: [{ name: 'username', label: 'Username (without @)', type: 'text', placeholder: 'username', required: true }, { name: 'message', label: 'Pre-filled message', type: 'text', placeholder: 'Hello!' }] },
  { type: 'zoom', label: 'Zoom Meeting', icon: 'Video', description: 'Join a Zoom meeting directly', category: 'business', fields: [{ name: 'url', label: 'Zoom Meeting URL', type: 'url', placeholder: 'https://zoom.us/j/...', required: true }] },
  { type: 'google_meet', label: 'Google Meet', icon: 'Monitor', description: 'Join a Google Meet call', category: 'business', fields: [{ name: 'url', label: 'Meet URL', type: 'url', placeholder: 'https://meet.google.com/xxx-xxxx-xxx', required: true }] },
  { type: 'teams', label: 'Microsoft Teams', icon: 'Users', description: 'Join a Microsoft Teams meeting', category: 'business', fields: [{ name: 'url', label: 'Teams Meeting URL', type: 'url', placeholder: 'https://teams.microsoft.com/l/meetup-join/...', required: true }] },
  { type: 'youtube', label: 'YouTube', icon: 'Youtube', description: 'Link to a YouTube video or channel', category: 'social', fields: [{ name: 'url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/watch?v=...', required: true }] },
  { type: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', description: 'Link to a LinkedIn profile or company page', category: 'social', fields: [{ name: 'url', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username', required: true }] },
  { type: 'spotify', label: 'Spotify', icon: 'Music2', description: 'Link to a Spotify track, album, or playlist', category: 'social', fields: [{ name: 'url', label: 'Spotify URL', type: 'url', placeholder: 'https://open.spotify.com/track/...', required: true }] },
  { type: 'paypal', label: 'PayPal.me', icon: 'CreditCard', description: 'PayPal.me payment link', category: 'payments', fields: [{ name: 'username', label: 'PayPal.me Username', type: 'text', placeholder: 'yourname', required: true }, { name: 'amount', label: 'Amount (optional)', type: 'text', placeholder: '10.00' }, { name: 'currency', label: 'Currency code', type: 'text', placeholder: 'USD' }] },
  { type: 'upi', label: 'UPI Payment', icon: 'IndianRupee', description: 'Indian UPI payment link (BHIM/GPay/PhonePe)', category: 'payments', fields: [{ name: 'pa', label: 'UPI ID (pa)', type: 'text', placeholder: 'name@upi', required: true }, { name: 'pn', label: 'Payee Name (pn)', type: 'text', placeholder: 'John Doe' }, { name: 'amount', label: 'Amount (am)', type: 'text', placeholder: '100' }, { name: 'cu', label: 'Currency (cu)', type: 'text', placeholder: 'INR' }, { name: 'tn', label: 'Note (tn)', type: 'text', placeholder: 'Payment for...' }] },
  { type: 'bitcoin', label: 'Bitcoin', icon: 'Bitcoin', description: 'Bitcoin payment URI (BIP-21)', category: 'payments', fields: [{ name: 'address', label: 'Bitcoin Address', type: 'text', placeholder: 'bc1q...', required: true }, { name: 'amount', label: 'Amount (BTC)', type: 'text', placeholder: '0.001' }, { name: 'label', label: 'Label', type: 'text', placeholder: 'Donation' }, { name: 'message', label: 'Message', type: 'text', placeholder: 'Thanks!' }] },
  { type: 'ethereum', label: 'Ethereum', icon: 'Coins', description: 'Ethereum payment URI (EIP-681)', category: 'payments', fields: [{ name: 'address', label: 'ETH Address (0x...)', type: 'text', placeholder: '0xAbC...', required: true }, { name: 'amount', label: 'Amount (ETH)', type: 'text', placeholder: '0.01' }] },
  { type: 'sepa', label: 'SEPA Transfer', icon: 'Building2', description: 'European SEPA credit transfer (EPC QR)', category: 'payments', fields: [{ name: 'name', label: 'Beneficiary Name', type: 'text', placeholder: 'Max Mustermann', required: true }, { name: 'iban', label: 'IBAN', type: 'text', placeholder: 'DE89370400440532013000', required: true }, { name: 'bic', label: 'BIC', type: 'text', placeholder: 'COBADEFFXXX' }, { name: 'amount', label: 'Amount (EUR)', type: 'text', placeholder: '100.00' }, { name: 'reason', label: 'Payment Reference', type: 'text', placeholder: 'Invoice 2024-001' }] },
  { type: 'google_review', label: 'Google Review', icon: 'Star', description: 'Direct link to your Google Business review page', category: 'business', fields: [{ name: 'url', label: 'Google Review URL', type: 'url', placeholder: 'https://g.page/r/...', required: true }] },
];

export function generateQRData(type: QRType, data: QRData): string {
  switch (type) {
    case 'text': return data['text'] ?? '';
    case 'url': case 'pdf': case 'audio': case 'video': case 'image': return data['url'] ?? '';
    case 'whatsapp':
      if (!data['phone']) return '';
      return `https://wa.me/${data['phone'].replace(/\D/g, '')}${data['message'] ? `?text=${encodeURIComponent(data['message'])}` : ''}`;
    case 'phone': return data['number'] ? `tel:${data['number']}` : '';
    case 'sms':
      if (!data['number']) return '';
      return `sms:${data['number']}${data['message'] ? `?body=${encodeURIComponent(data['message'])}` : ''}`;
    case 'email':
      if (!data['email']) return '';
      return `mailto:${data['email']}${data['subject'] || data['body'] ? `?${data['subject'] ? `subject=${encodeURIComponent(data['subject'])}` : ''}${data['body'] ? `${data['subject'] ? '&' : ''}body=${encodeURIComponent(data['body'])}` : ''}` : ''}`;
    case 'address': return data['address'] ? `https://maps.google.com/?q=${encodeURIComponent(data['address'])}` : '';
    case 'wifi':
      if (!data['ssid']) return '';
      return `WIFI:T:${data['encryption'] || 'WPA'};S:${data['ssid']};${data['encryption'] !== 'nopass' ? `P:${data['password'] ?? ''};` : ''};`;
    case 'vcard':
      if (!data['name']) return '';
      return `MECARD:N:${data['name']};${data['phone'] ? `TEL:${data['phone']};` : ''}${data['email'] ? `EMAIL:${data['email']};` : ''}${data['org'] ? `ORG:${data['org']};` : ''};;`;
    case 'social': {
      if (!data['username']) return '';
      const platform = data['platform'] ?? 'twitter';
      const username = data['username'].replace(/^@/, '');
      const urls: Record<string, string> = { twitter: `https://twitter.com/${username}`, instagram: `https://instagram.com/${username}`, facebook: `https://facebook.com/${username}`, linkedin: `https://linkedin.com/in/${username}`, tiktok: `https://tiktok.com/@${username}` };
      return urls[platform] ?? username;
    }
    case 'menu': {
      const parts: string[] = [];
      if (data['title']) parts.push(data['title']);
      if (data['items']) parts.push(data['items']);
      if (data['url']) parts.push(`Menu: ${data['url']}`);
      return parts.join('\n');
    }
    case 'app': {
      if (data['platform'] === 'both') return `iOS: ${data['iosUrl'] ?? ''}\nAndroid: ${data['androidUrl'] ?? ''}`;
      if (data['platform'] === 'ios') return data['iosUrl'] ?? '';
      if (data['platform'] === 'android') return data['androidUrl'] ?? '';
      return data['iosUrl'] ?? data['androidUrl'] ?? '';
    }
    case 'coupon': {
      const parts: string[] = [];
      if (data['code']) parts.push(`Coupon: ${data['code']}`);
      if (data['description']) parts.push(data['description']);
      if (data['url']) parts.push(`Redeem at: ${data['url']}`);
      return parts.join('\n');
    }
    case 'event': {
      if (!data['title']) return '';
      const startDate = data['date'] ? data['date'].replace(/-/g, '') : '';
      const startTime = data['time'] ? data['time'].replace(':', '') + '00' : '';
      const dates = startDate ? (startTime ? `${startDate}T${startTime}/${startDate}T${startTime}` : `${startDate}/${startDate}`) : '';
      return dates ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data['title'])}&dates=${dates}&details=${encodeURIComponent(data['description'] ?? '')}&location=${encodeURIComponent(data['location'] ?? '')}` : `Event: ${data['title']}`;
    }
    case 'business_card': {
      const parts: string[] = [];
      if (data['name']) parts.push(data['name']);
      if (data['title']) parts.push(data['title']);
      if (data['company']) parts.push(data['company']);
      if (data['phone']) parts.push(`Tel: ${data['phone']}`);
      if (data['email']) parts.push(`Email: ${data['email']}`);
      if (data['website']) parts.push(`Web: ${data['website']}`);
      if (data['address']) parts.push(data['address']);
      return parts.join('\n');
    }
    case 'freelance': {
      const parts: string[] = [];
      if (data['name']) parts.push(data['name']);
      if (data['skill']) parts.push(data['skill']);
      if (data['portfolio']) parts.push(`Portfolio: ${data['portfolio']}`);
      if (data['email']) parts.push(`Contact: ${data['email']}`);
      return parts.join('\n');
    }
    case 'ecommerce': return [data['productName'], data['price'] ? `Price: ${data['price']}` : '', data['url']].filter(Boolean).join('\n');
    case 'cleaning': return [data['company'], data['phone'] ? `Book: ${data['phone']}` : '', data['url'] ? `Online: ${data['url']}` : ''].filter(Boolean).join('\n');
    case 'logistics': return [data['trackingNumber'] ? `Tracking: ${data['trackingNumber']}` : '', data['url']].filter(Boolean).join('\n');
    case 'finance': return [data['service'], data['account'] ? `Account: ${data['account']}` : '', data['url']].filter(Boolean).join('\n');
    case 'cv': return [data['name'], data['title'], data['url'] ? `CV: ${data['url']}` : ''].filter(Boolean).join('\n');
    case 'mecard':
      if (!data['name']) return '';
      return `MECARD:N:${data['name']};${data['tel'] ? `TEL:${data['tel']};` : ''}${data['email'] ? `EMAIL:${data['email']};` : ''}${data['url'] ? `URL:${data['url']};` : ''}${data['address'] ? `ADR:${data['address']};` : ''}${data['nickname'] ? `NICKNAME:${data['nickname']};` : ''}${data['birthday'] ? `BDAY:${data['birthday']};` : ''};;`;
    case 'geo': return (data['lat'] && data['lng']) ? `geo:${data['lat']},${data['lng']}` : '';
    case 'telegram': return data['username'] ? `https://t.me/${data['username']}${data['message'] ? `?text=${encodeURIComponent(data['message'])}` : ''}` : '';
    case 'zoom': case 'google_meet': case 'teams': case 'youtube': case 'linkedin': case 'spotify': case 'google_review': return data['url'] ?? '';
    case 'paypal': return data['username'] ? `https://paypal.me/${data['username']}${data['amount'] ? `/${data['amount']}${data['currency'] ?? 'USD'}` : ''}` : '';
    case 'upi': return data['pa'] ? `upi://pay?pa=${encodeURIComponent(data['pa'])}${data['pn'] ? `&pn=${encodeURIComponent(data['pn'])}` : ''}${data['amount'] ? `&am=${data['amount']}` : ''}${data['cu'] ? `&cu=${data['cu']}` : '&cu=INR'}${data['tn'] ? `&tn=${encodeURIComponent(data['tn'])}` : ''}` : '';
    case 'bitcoin': {
      if (!data['address']) return '';
      const btcParts: string[] = [];
      if (data['amount']) btcParts.push(`amount=${data['amount']}`);
      if (data['label']) btcParts.push(`label=${encodeURIComponent(data['label'])}`);
      if (data['message']) btcParts.push(`message=${encodeURIComponent(data['message'])}`);
      return `bitcoin:${data['address']}${btcParts.length > 0 ? `?${btcParts.join('&')}` : ''}`;
    }
    case 'ethereum': return data['address'] ? `ethereum:${data['address']}${data['amount'] ? `?value=${data['amount']}` : ''}` : '';
    case 'sepa': return (data['name'] && data['iban']) ? `BCD\n002\n1\nSCT\n${data['bic'] ?? ''}\n${data['name']}\n${data['iban']}\nEUR${data['amount'] ?? ''}\n\n\n${data['reason'] ?? ''}` : '';
    default: return '';
  }
}

export function getTypeConfig(type: QRType): QRTypeConfig | undefined {
  return qrTypeConfigs.find(c => c.type === type);
}

export function validateField(field: { type: string; required?: boolean }, value: string): string | null {
  if (field.required && !value.trim()) return 'This field is required';
  if (value.trim()) {
    if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    }
    if (field.type === 'url') {
      try { new URL(value); } catch { return 'Please enter a valid URL (include https://)'; }
    }
    if (field.type === 'tel') {
      if (!/^[\d\s+\-()]+$/.test(value)) return 'Please enter a valid phone number';
    }
  }
  return null;
}

export function getContrastRatio(fg: string, bg: string): number {
  function hexToLinearLuminance(hex: string): number {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(full.slice(0, 2), 16) / 255;
    const g = parseInt(full.slice(2, 4), 16) / 255;
    const b = parseInt(full.slice(4, 6), 16) / 255;
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }
  const l1 = hexToLinearLuminance(fg);
  const l2 = hexToLinearLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function getAutoECLevel(hasLogo: boolean, dataLength: number): ECLevel {
  if (hasLogo) return 'H';
  if (dataLength > 1000) return 'L';
  return 'M';
}

export const QR_CATEGORIES: Record<string, QRType[]> = {
  popular: qrTypeConfigs.filter(c => c.category === 'popular').map(c => c.type),
  social: qrTypeConfigs.filter(c => c.category === 'social').map(c => c.type),
  payments: qrTypeConfigs.filter(c => c.category === 'payments').map(c => c.type),
  business: qrTypeConfigs.filter(c => c.category === 'business').map(c => c.type),
  utilities: qrTypeConfigs.filter(c => c.category === 'utilities').map(c => c.type),
};
