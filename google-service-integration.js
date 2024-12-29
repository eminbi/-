// services/googleAPI/sheetsService.js
const { google } = require('googleapis');

class GoogleSheetsService {
  constructor(auth) {
    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.SPREADSHEET_ID;
  }

  async getResearchList() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Research List!A2:I',
      });

      return response.data.values.map(row => ({
        id: row[0],
        title: row[1],
        authors: row[2],
        year: row[3],
        type: row[4],
        summary: row[5],
        tags: row[6],
        lastModified: row[7],
        usageHistory: row[8]
      }));
    } catch (error) {
      console.error('Error fetching research list:', error);
      throw error;
    }
  }

  async addResearchItem(data) {
    try {
      const values = [
        [
          data.id,
          data.title,
          data.authors,
          data.year,
          data.type,
          data.summary,
          data.tags,
          new Date().toISOString(),
          ''
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Research List!A2:I2',
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return data.id;
    } catch (error) {
      console.error('Error adding research item:', error);
      throw error;
    }
  }
}

// services/googleAPI/driveService.js
class GoogleDriveService {
  constructor(auth) {
    this.drive = google.drive({ version: 'v3', auth });
    this.folderID = process.env.DRIVE_FOLDER_ID;
  }

  async uploadFile(fileBuffer, fileName, mimeType) {
    try {
      const fileMetadata = {
        name: fileName,
        parents: [this.folderID]
      };

      const media = {
        mimeType,
        body: fileBuffer
      };

      const file = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });

      return {
        fileId: file.data.id,
        webViewLink: file.data.webViewLink
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFileList() {
    try {
      const response = await this.drive.files.list({
        q: `'${this.folderID}' in parents`,
        fields: 'files(id, name, webViewLink, mimeType)',
        pageSize: 100
      });

      return response.data.files;
    } catch (error) {
      console.error('Error fetching file list:', error);
      throw error;
    }
  }
}

// services/googleAPI/slidesService.js
class GoogleSlidesService {
  constructor(auth) {
    this.slides = google.slides({ version: 'v1', auth });
  }

  async createPresentation(title, content) {
    try {
      // Create a new presentation
      const presentation = await this.slides.presentations.create({
        requestBody: {
          title
        }
      });

      const presentationId = presentation.data.presentationId;

      // Add slides
      const requests = this.generateSlideRequests(content);
      await this.slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests
        }
      });

      return presentationId;
    } catch (error) {
      console.error('Error creating presentation:', error);
      throw error;
    }
  }

  generateSlideRequests(content) {
    const requests = [];

    // Title slide
    requests.push({
      createSlide: {
        objectId: 'titleSlide',
        slideLayoutReference: {
          predefinedLayout: 'TITLE'
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: 'TITLE'
            },
            objectId: 'titleText'
          }
        ]
      }
    });

    // Content slides
    content.forEach((section, index) => {
      requests.push({
        createSlide: {
          objectId: `slide_${index}`,
          slideLayoutReference: {
            predefinedLayout: 'TITLE_AND_BODY'
          }
        }
      });
    });

    return requests;
  }
}
