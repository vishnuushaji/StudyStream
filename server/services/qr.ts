import QRCode from "qrcode";

export class QRService {
  async generateQRCode(url: string): Promise<string> {
    try {
      // Generate QR code as data URL (base64 image)
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}

export const qrService = new QRService();
