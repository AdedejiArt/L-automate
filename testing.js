const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { WebClient } = require('@slack/web-api');

const app = express();
app.use(bodyParser.json());

// Set up the Asana webhook
app.post('/webhook', async (req, res) => {
  const { events } = req.body;
  for (const event of events) {
    if (event.action === 'changed' && event.fields.includes('completed')) {
      const taskId = event.resource.id;
      console.log(`Task ${taskId} has been marked completed`);
      
      // Use the Asana API to get the task details
      const asanaUrl = `https://app.asana.com/api/1.0/tasks/${taskId}`;
      const options = {
        url: asanaUrl,
        headers: {
          'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`
        }
      };
      request(options, async (error, response, body) => {
        if (error) {
          console.error(error);
        } else {
          const task = JSON.parse(body).data;
          const taskName = task.name;
          const assigneeId = task.assignee.id;
          
          // Use the Slack API to send a message to the task assignee
          const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
          const messageText = `Task "${taskName}" has been marked completed on Asana`;
          const result = await slackClient.chat.postMessage({
            channel: assigneeId,
            text: messageText
          });
          console.log(`Message sent to user ${assigneeId}: ${messageText}`);
        }
      });
    }
  }
  res.sendStatus(200);
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('App is running!');
})();