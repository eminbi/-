// tests/integration/research.test.js
const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');

describe('Research API Integration Tests', () => {
  let researchId;

  before(async () => {
    // Setup test database
  });

  after(async () => {
    // Cleanup test database
  });

  describe('POST /api/research/item', () => {
    it('should create a new research item', async () => {
      const response = await request(app)
        .post('/api/research/item')
        .send({
          title: 'Test Research',
          authors: 'Test Author',
          year: 2024,
          type: 'Paper',
          summary: 'Test summary'
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
      researchId = response.body.data.id;
    });
  });

  describe('GET /api/research/item/:id', () => {
    it('should retrieve a research item', async () => {
      const response = await request(app)
        .get(`/api/research/item/${researchId}`);

      expect(response.status).to.equal(200);
      expect(response.body.data.title).to.equal('Test Research');
    });
  });
});

// tests/unit/services/aiService.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const AIService = require('../../../services/aiService');

describe('AI Service Unit Tests', () => {
  let openAIStub;

  beforeEach(() => {
    openAIStub = sinon.stub(AIService.openai, 'createChatCompletion');
  });

  afterEach(() => {
    openAIStub.restore();
  });

  describe('generateContentSummary', () => {
    it('should generate a summary from content', async () => {
      openAIStub.resolves({
        data: {
          choices: [{
            message: {
              content: 'Test summary'
            }
          }]
        }
      });

      const summary = await AIService.generateContentSummary('Test content');
      expect(summary).to.equal('Test summary');
    });
  });
});
