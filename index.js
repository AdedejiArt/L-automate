require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api');
const { App, ExpressReceiver } = require('@slack/bolt');
const request = require('request');
const asana = require('asana');
const axios = require('axios');
const apiKey = 'TtKzttivQvq/wK4N/P81uw';
const contractTemplateId = '02swNcHVj0PsBSraZfxhec';
const organizationId = 992330;
const nodemailer = require('nodemailer');
// var newEmailAddress = 'newemail@example.com';
const payload = {
    "organizationId": 992330,
    "source": {
      "uid": contractTemplateId,
      "templatingParameters": {
        "property1": "string",
        "property2": "string"
      }
    },
    "folderId": 1136156,
    "status": "DRAFT",
    "parametersSource": "NONE",
    "title": "Non-Disclosure Agreement",
    "description": "This NDA covers the company for 10 years.",
    "tags": [
      "string"
    ],
    "parties": {
        'Party A': {
          name: 'John Doe',
          email: 'a.roheem@alustudent.com',
        },
        'Party B': {
          name: 'Jane Smith',
          email: 'adiobusrat@gmail.com',
        },
      },
    
  };
  const payloadr={
    "invitations": {
      "adiobusrat@gmail.com": {
        "permission": "NO_EDIT"
        
      }
    },
    "message": {
      "subject": "Invitation to sign",
      "content": "Hello, this is an invite for a Non-Disclosure Agreement.",
      "name": "Internal message name"
    },
    "saveMessage": false,
    "sendWithDocument": false
  }






const abi = express();
abi.use(bodyParser.json());
const asana_client = asana.Client.create().useAccessToken('process.env.ASANA_ACCESS_TOKEN');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
// const slackBotToken = process.env.SLACK_BOT_TOKEN;
// const client = new WebClient(slackBotToken);
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Slack app home page
app.event('app_home_opened', async ({ event, context }) => {
  try {
    const result = await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: {
        type: 'home',
        callback_id: 'home_view',
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Hey there! Welcome to L-automate. I am here to help you with your legal needs."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Automated Contract Creation*"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " You can create contracts without needing to reach out to the In-house legal teams.They would receive notifications that you have created a contract, Don't Worry! "
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create a freelancer Contract"
                },
                "action_id": "new_freelancer_alu_selector"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create a Vendor Contract"
                },
                "action_id": "vendor_request"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create an NDA"
                },
                "action_id": "nda_create"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create an Mou"
                },
                "action_id": "mou_create"
              }
            ]
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Create New Legal Requests*"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Let the legal team know what you need from them?"
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Review and Sign a Contract"
                },
                "action_id": "contract_review"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "You wanna access Company Documents"
                },
                "action_id": "documentation_request"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "You wanna ask a question"
                },
                "action_id": "advice_request"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "You need a template!"
                },
                "action_id": "template_request"
              }
            ]
          }
        ],
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

// Handle button click on the app home page
app.action('contract_review', async ({ ack, body, context }) => {
  try {
    // Acknowledge the button click
    await ack();

    // Open a modal to gather user input
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'task_submission',
        title: {
          type: 'plain_text',
          text: 'Create a New Task',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'task_name',
            element: {
              type: 'plain_text_input',
              action_id: 'task_name_input',
            },
            label: {
              type: 'plain_text',
              text: 'Task Name',
            },
          },
          {
            "type": "input",
            "block_id": "Document_Link",
            "hint": {"type": "plain_text", "text": "Please make sure this link is publicly available so the team can see it."},
            "label": {"type": "plain_text", "text": "Please paste a link to the document to review"},
            "element": {
                "type": "plain_text_input",
                "action_id": "link_input"
            }
        }, {
            "type": "input",
            "block_id": "Partner",
            "label": {"type": "plain_text", "text": "Who is this contract with?"},
            "element": {
                "type": "plain_text_input",
                "action_id": "partner_input"
            }
        }, {
            "type": "input",
            "block_id": "Context",
            "label": {"type": "plain_text", "text": "Why are we reviewing this contract?"},
            "hint": {"type": "plain_text", "text": "Please provide any additional context you can to the team."},
            "element": {
                "type": "plain_text_input",
                "action_id": "context_input",
                'multiline': true
            }
        }, {"type": "input", 
                "block_id": "Value", 
                "label": 
                {
                  "type": "plain_text", 
                  "text": "How would you estimate the total value of this contract?:"
                },
                "element": {
                          "type": "radio_buttons",
                          "action_id": "value_input",
                          "options": [{
                                      "text": {
                                          "type": "plain_text",
                                          "text": "50,000 usd or lower"
                                        },
                                        "value": "low"
                                  },
                                  {
                                      "text": {
                                          "type": "plain_text",
                                          "text": "Over 50,000 usd"
                                        },
                                        "value": "high"
                                  }
                            ]
                        }
                    }, 
                    {
                      type: 'input',
                      block_id: 'task_due_date',
                      element: {
                        type: 'datepicker',
                        action_id: 'task_due_date_input',
                      },
                      label: {
                        type: 'plain_text',
                        text: 'Due Date',
                      },
                    },
        ],
        submit: {
          type: 'plain_text',
          text: 'Create',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
app.action('documentation_request', async ({ ack, body, context }) => {
  try {
    // Acknowledge the button click
    await ack();

    // Open a modal to gather user input
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'documentation_task_submission',
        title: {
          type: 'plain_text',
          text: 'Create a New Task',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'task_name',
            element: {
              type: 'plain_text_input',
              action_id: 'task_name_input',
            },
            label: {
              type: 'plain_text',
              text: 'Task Name',
            },
          },
         
          {
            type: 'input',
            block_id: 'task_description',
            element: {
              type: 'plain_text_input',
              action_id: 'task_description_input',
            },
            label: {
              type: 'plain_text',
              text: 'Description',
            },
          },
          {
            type: 'input',
            block_id: 'task_due_date',
            element: {
              type: 'datepicker',
              action_id: 'task_due_date_input',
            },
            label: {
              type: 'plain_text',
              text: 'Due Date',
            },
          },
        ],
        submit: {
          type: 'plain_text',
          text: 'Create',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.action('nda_create', async ({ ack, body, context }) => {
  try {
    // Acknowledge the button click
    await ack();

    // Open a modal to gather user input
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'contract_submission',
        title: {
          type: 'plain_text',
          text: 'Create a New Contract',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'document_title',
            element: {
              type: 'plain_text_input',
              action_id: 'document_title_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the title of this document',
            },
          },
         
          {
            type: 'input',
            block_id: 'client_location',
            element: {
              type: 'plain_text_input',
              action_id: 'contract_type_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Client Location',
            },
          },
            
          {
            type: 'input',
            block_id: 'payment_frequency',
            element: {
              type: 'plain_text_input',
              action_id: 'payment_frequency_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Payment Frequency',
            },
          },
            
           
            
          {
            type: 'input',
            block_id: 'service_fee',
            element: {
              type: 'plain_text_input',
              action_id: 'service_fee_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Service fee',
            },
          },
          {
            "type": "input",
            "block_id": "party_a",
            "label": {
              "type": "plain_text",
              "text": "Enter your email address"
            },
            "element": {
              "type": "plain_text_input",
              "action_id": "party_a_input",
              "placeholder": {
                "type": "plain_text",
                "text": "example@example.com"
              }
            }
          },
          {
            "type": "input",
            "block_id": "party_b",
            "label": {
              "type": "plain_text",
              "text": "Enter your email address"
            },
            "element": {
              "type": "plain_text_input",
              "action_id": "party_b_input",
              "placeholder": {
                "type": "plain_text",
                "text": "example@example.com"
              }
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Create',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

 

// Handle the "task_submission" view submission
app.view('task_submission', async ({ ack, body, view, context }) => {
    try {
      // Acknowledge the view submission
      await ack();
  
      // Extract user input from the view
      const taskName = view.state.values.task_name.task_name_input.value;
      const document_link=view.state.values.Document_Link.link_input.value;
      const Partner=view.state.values.Partner.partner_input.value; 
      const context = view.state.values.Context.context_input.value;
     
      const value = view.state.values.Value.value_input.value;
     
      // const description = view.state.values.task_description.task_description_input.value;
      const dueDate = view.state.values.task_due_date.task_due_date_input.selected_date;
        // const dueDate = calculateDeadlines(currentTimeMillis, 2)
  
      // Asana API endpoint to create a new task
      const url = 'https://app.asana.com/api/1.0/tasks';
  
      // Asana API request parameters
      const options = {
        method: 'POST',
        url,
        headers: {
          'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: {
          data: {
            name: taskName,
            assignee: "me",
            notes: context,
            due_on: dueDate,
            html_notes:"<body><strong><em>Context:</em></strong>"+ document_link+ "<strong><em>Objective:</em></strong>"+ Partner + value + "</body>",
            workspace:'1203000597959895'
          },
        },
        json: true,
      };
      abi.post('/webhook', async (req, res) => {
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
      
  
      // Send the task creation request to the Asana API
      request(options, async (error, response, asanaBody) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Asana API response:', asanaBody);
  
          // Construct the message text with the link to the new task
          const taskLink = asanaBody.data.permalink_url;
          const messageText = `New task "${taskName}" has been created: ${taskLink}`;
  
          // Send a message to the user who submitted the form
          const userId = body.user.id;
          console.log('User ID:', userId);
          await app.client.chat.postMessage({
            token: context.botToken,
            channel: userId,
            text: messageText,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  });


  app.view('documentation_task_submission', async ({ ack, body, view, context }) => {
    try {
      // Acknowledge the view submission
      await ack();
  
      // Extract user input from the view
      const taskName = view.state.values.task_name.task_name_input.value;
       
     
      const description = view.state.values.task_description.task_description_input.value;
      const dueDate = view.state.values.task_due_date.task_due_date_input.selected_date;
        
      // Asana API endpoint to create a new task
      const url = 'https://app.asana.com/api/1.0/tasks';
  
      // Asana API request parameters
      const options = {
        method: 'POST',
        url,
        headers: {
          'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: {
          data: {
            name: taskName,
            assignee: "me",
            notes: description,
            due_on: dueDate,
            workspace:'1203000597959895'
          },
        },
        json: true,
      };
  
      // Send the task creation request to the Asana API
      request(options, async (error, response, asanaBody) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Asana API response:', asanaBody);
  
          // Construct the message text with the link to the new task
          const taskLink = asanaBody.data.permalink_url;
          const messageText = `New task "${taskName}" has been created: ${taskLink}`;
  
          // Send a message to the user who submitted the form
          const userId = body.user.id;
          console.log('User ID:', userId);
          await app.client.chat.postMessage({
            token: context.botToken,
            channel: userId,
            text: messageText,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  async function createContract() {
    try {
      const response = await axios.post(
          `https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements`,
        payload,
        {
          headers: {
              'X-API-KEY': apiKey
          },
        }
      );
      const postId = response.data.id;
      const inviteMember = await axios.post(
        `https://api.concordnow.com/api/rest/1/organizations/992330/agreements/${postId}/members`,
      payloadr,
      {
        headers: {
            'X-API-KEY': apiKey
        },
      }
    );
       inviteMember.data
    } catch (error) {
      console.error(error);
    }
  }
  // async function sendEmail(userEmail) {
  //   // Create a nodemailer transport object with your email service provider settings
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.gmail.com',
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: 'adioadedeji5@gmail.com',
  //       pass: 'oqvcdjfeyyxzkbrv',
  //     },
  //   });
  
  //   // Define the message options, including the recipient's email address
  //   const message = {
  //     from: 'adioadedeji5@gmail.com',
  //     to: userEmail,
  //     subject: 'Your message subject',
  //     text: 'Your message text',
  //     html: '<p>You have been invited to sign a contract and Here is the link</p>',
  //   };
  
  //   // Send the email
  //   const info = await transporter.sendMail(message);
  
  //   // Log the message ID for debugging purposes
  //   console.log(`Message sent: ${info.messageId}`);
  // }
  app.view('contract_submission', async ({ ack, body, view, context }) => {
    try {
      // Acknowledge the view submission
      await ack();
      const contracttitle=view.state.values.document_title.document_title_input.value;


      const newEmailAddress = view.state.values.party_a.party_a_input.value;
      payload["title"] = contracttitle
      payloadr.invitations[newEmailAddress] = payloadr.invitations['adiobusrat@gmail.com'];
      delete payloadr.invitations['adiobusrat@gmail.com'];
      console.log(payloadr.invitations)
      // Extract user input from the view
      createContract();
      
      // Send the task creation request to the Asana API
      
    } catch (error) {
      console.error(error);
    }
  });


  
  (async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);
  
    console.log('App is running!');
  })();
  
