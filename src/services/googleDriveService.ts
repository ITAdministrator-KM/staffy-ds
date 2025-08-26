// Google Drive Service for document management
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  webViewLink: string;
  webContentLink: string;
  createdTime: string;
}

export interface UploadResult {
  success: boolean;
  file?: DriveFile;
  error?: string;
}

export class GoogleDriveService {
  private static accessToken: string | null = null;

  // Initialize Google Drive API
  static async initialize(): Promise<boolean> {
    try {
      // Load Google API
      if (!(window as any).gapi) {
        await this.loadGoogleAPI();
      }

      return new Promise((resolve) => {
        (window as any).gapi.load('auth2:client', async () => {
          await (window as any).gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file'
          });
          resolve(true);
        });
      });
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      return false;
    }
  }

  private static loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  // Authenticate user
  static async authenticate(): Promise<boolean> {
    try {
      const authInstance = (window as any).gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      
      const user = authInstance.currentUser.get();
      this.accessToken = user.getAuthResponse().access_token;
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  // Upload file to Google Drive
  static async uploadFile(file: File, folderName: string = 'DStaff Documents'): Promise<UploadResult> {
    try {
      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return { success: false, error: 'Authentication failed' };
        }
      }

      // Create folder if it doesn't exist
      const folderId = await this.createOrGetFolder(folderName);
      
      // Upload file
      const metadata = {
        name: file.name,
        parents: [folderId]
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: form
      });

      if (response.ok) {
        const result = await response.json();
        const fileDetails = await this.getFileDetails(result.id);
        return { success: true, file: fileDetails };
      } else {
        return { success: false, error: 'Upload failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Create or get folder
  private static async createOrGetFolder(folderName: string): Promise<string> {
    try {
      // Search for existing folder
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const searchResult = await searchResponse.json();
      
      if (searchResult.files && searchResult.files.length > 0) {
        return searchResult.files[0].id;
      }

      // Create new folder
      const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });

      const createResult = await createResponse.json();
      return createResult.id;
    } catch (error) {
      throw new Error('Failed to create/get folder');
    }
  }

  // Get file details
  private static async getFileDetails(fileId: string): Promise<DriveFile> {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,webViewLink,webContentLink,createdTime`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );

    return await response.json();
  }

  // List user's files
  static async listFiles(folderName: string = 'DStaff Documents'): Promise<DriveFile[]> {
    try {
      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return [];
        }
      }

      const folderId = await this.createOrGetFolder(folderName);
      
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=parents in '${folderId}'&fields=files(id,name,mimeType,size,webViewLink,webContentLink,createdTime)`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const result = await response.json();
      return result.files || [];
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  // Delete file
  static async deleteFile(fileId: string): Promise<boolean> {
    try {
      if (!this.accessToken) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return false;
        }
      }

      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }
}