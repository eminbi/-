// services/aiService.js
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

class AIService {
  constructor() {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY
      })
    );
    this.claudeApiKey = process.env.CLAUDE_API_KEY;
  }

  async generateContentSummary(content) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a research assistant specializing in animal behavior and human-animal interaction studies."
          },
          {
            role: "user",
            content: `Please provide a concise summary of the following research content: ${content}`
          }
        ],
        max_tokens: 500
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating content summary:', error);
      throw error;
    }
  }

  async generatePresentationStructure(research) {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Please create a presentation structure for the following research: ${JSON.stringify(research)}`
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.claudeApiKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error generating presentation structure:', error);
      throw error;
    }
  }

  async searchRelatedResearch(query) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a research assistant helping to find relevant academic papers and research materials."
          },
          {
            role: "user",
            content: `Find relevant academic research materials related to: ${query}`
          }
        ],
        max_tokens: 500
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error searching related research:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
