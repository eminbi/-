// controllers/researchController.js
const GoogleSheetsService = require('../services/googleAPI/sheetsService');
const GoogleDriveService = require('../services/googleAPI/driveService');
const AIService = require('../services/aiService');

class ResearchController {
  constructor() {
    this.sheetsService = new GoogleSheetsService(auth);
    this.driveService = new GoogleDriveService(auth);
  }

  async createResearchEntry(req, res) {
    try {
      const { title, authors, year, type, content, files } = req.body;

      // Generate AI summary
      const summary = await AIService.generateContentSummary(content);

      // Add to spreadsheet
      const researchData = {
        id: Date.now().toString(),
        title,
        authors,
        year,
        type,
        summary
      };
      
      await this.sheetsService.addResearchItem(researchData);

      // Upload files
      const uploadedFiles = [];
      for (const file of files) {
        const uploadResult = await this.driveService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        uploadedFiles.push(uploadResult);
      }

      // Search for related research
      const relatedResearch = await AIService.searchRelatedResearch(title);

      res.status(200).json({
        success: true,
        data: {
          ...researchData,
          files: uploadedFiles,
          relatedResearch
        }
      });
    } catch (error) {
      console.error('Error in createResearchEntry:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async generatePresentation(req, res) {
    try {
      const { researchId } = req.params;
      
      // Get research data
      const researchData = await this.sheetsService.getResearchItemById(researchId);
      
      // Generate presentation structure using Claude
      const presentationStructure = await AIService.generatePresentationStructure(researchData);
      
      // Create presentation
      const slidesService = new GoogleSlidesService(auth);
      const presentationId = await slidesService.createPresentation(
        researchData.title,
        presentationStructure
      );

      res.status(200).json({
        success: true,
        data: {
          presentationId,
          presentationUrl: `https://docs.google.com/presentation/d/${presentationId}`
        }
      });
    } catch (error) {
      console.error('Error in generatePresentation:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ResearchController();
