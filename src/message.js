/*
 * message.js
 * This file contains your bot code
 */
const recastai = require('recastai')

// This function is the core of the bot behaviour
const replyMessage = (message) => {
    // Instantiate Recast.AI SDK, just for request service
    const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
    // Get text from message received
    const text = message.content

    //  console.log('I receive: <%s>', text)

    // Get senderId to catch unique conversation_token
    const senderId = message.senderId

    // Call Recast.AI SDK, through /converse route
    request.converseText(text, {
            conversationToken: senderId
        })
        .then(result => {
            /*
             * YOUR OWN CODE
             * Here, you can add your own process.
             * Ex: You can call any external API
             * Or: Update your mongo DB
             * etc...
             */
               console.log('object is : ', result)
            if (result.action) {
                //      console.log('The conversation action is: ', result.action.slug)
            }
            //    console.log('intents is : ', result.intents[0])
            //    console.log('slug is : ', slug)

            if (result.intents && result.intents.length > 0 && result.intents[0].slug == "search-who" && result.entities && (result.entities.person || result.entities.personne)) {
                var person = (result.entities.person) ? result.entities.person[0].fullname : result.entities.personne[0].value;

                const wiki = require('./wiki');

                    console.log('person is : ', person);

                wiki(person, function(req, selected, text, url, confidence, image) {
                    console.log('request =' + req + '\n');
                    //       console.log(selected + '\n');
                    console.log("image : " + image + '\n');
                    //       console.log('url:' + url + '\n');
                    //       console.log('confidence:' + confidence + '\n');
                    if (confidence > 0.8) {
                        if (image) {
 /* not   working
                            message.addReply({
                                type: 'card',
                                content: {
                                    title: selected,
                                    subtitle: text,
                                    imageURL: image,
                                    buttons: [{
                                        title: 'wikipedia',
                                        type: 'web_url',
                                        value: url,
                                    }],
                                },
                            });*/      
                            
                                   /*
                            message.addReply({
                                type: 'picture',
                                content: 'http://render.openstreetmap.org/cgi-bin/export?bbox=2.27,48.84,2.30,48.85&scale=30000&format=jpeg'
                            });             */
                             message.addReply({
                                type: 'picture',
                                content: image
                            });
                                                        message.addReply({
                                type: 'text',
                                content: text
                            });      /*
                            message.addReply({
                                type: 'carousel',
                                content: {
                                    title: selected,
                                    imageUrl: image,
                                    buttons: [{
                                        title: 'Plus dinfos',
                                        type: 'web_url',
                                        value: url,
                                    }],
                                },
                            })    */

                        } else {
                            message.addReply({
                                type: 'text',
                                content: text
                            });
                        }
                    } else if (confidence > 0.5) {
                        message.addReply({
                            type: 'text',
                            content: 'Je propose: \"' + text + '\"." En fait, je ne sais pas si c\'est  vraiment \u00e7a.'
                        });
                    } else
                        message.addReply({
                            type: 'text',
                            content: 'Je ne sais.'
                        });

                    message.reply()
                        .then(() => {
                            // Do some code after sending messages
                        })
                        .catch(err => {
                            console.error('Error while sending message to channel', err)
                        })
                });
            } else if (result.intents && result.intents.length > 0 && result.intents[0].slug == "search-where" && result.entities && (result.entities.location || result.entities.lieu)) {
                var location = result.entities.location[0];

                const wiki = require('./wiki');

                    console.log('location is : ', location);

                wiki(location.raw, function(req, selected, text, url, confidence) {
                           console.log('confidence:' + confidence + '\n');
                    if (confidence > 0.6) {
                        message.addReply({
                                type: 'picture',
                                content: 'http://e220d290.ngrok.io/chatoli?x=' + location.lng + '&y=' + location.lat
                            });

                        message.addReply({
                            type: 'text',
                            content: text
                        });
                    } else if (confidence > 0.5) {
                        message.addReply({
                            type: 'text',
                            content: 'Je propose: \"' + text + '\"." En fait, je ne sais pas si c\'est  vraiment \u00e7a.'
                        });
                    } else
                        message.addReply({
                            type: 'text',
                            content: 'Je ne sais localiser ' + location.formatted
                        });

                    message.reply()
                        .then(() => {
                            // Do some code after sending messages
                        })
                        .catch(err => {
                            console.error('Error while sending message to channel', err)
                        })
                });
            } else if (result.intents && result.intents.length > 0 && result.intents[0].slug == "rdv-where" && result.entities && (result.entities.location || result.entities.lieu)) {
                var location = result.memory["lieu-rdv"];

                const rdv = require('./rdv');

                    console.log('location is : ', location);

                rdv(location.value,  function(req, list) {
                   
                  if (list.length) {
                      var s_pict =   'http://e220d290.ngrok.io/chatoli';
                      var o_button = []; 
                      var q = '?';
                      var i;
                      for(i = 0; (i < list.length) && (i<4); i++) {
                      var d = list[i];
                       s_pict = s_pict + q + '&mx' + (i+1) + '='+d.longitude + '&my' + (i+1) + '='+ d.latitude;
                       q='&';
                       o_button.push({
                                        title: d.prenom + ' ' + d.nom + ' ' + d.adresse,
                                        type: 'web_url',
                                        value: 'http://www.google.fr',
                                    })
                      }
                        message.addReply({
                                type: 'picture',
                                content:  s_pict
                            });
                         message.addReply({
                                type: 'card',
                                content: {
                                    title: 'Les médecins en proximité',
                                    buttons: o_button
                                },
                            });
                     } else
                        message.addReply({
                            type: 'text',
                            content: 'Je ne sais localiser ' + location.formatted
                        });

                    message.reply()
                        .then(() => {
                            // Do some code after sending messages
                        })
                        .catch(err => {
                            console.error('Error while sending message to channel', err)
                        })
                });
            } else {

                // If there is not any message return by Recast.AI for this current conversation
                if (!result.replies.length) {
                    message.addReply({
                        type: 'text',
                        content: 'Je suis encore un robot experimental dans le PC d\'Olivier je sais pas repondre a ca (batsmile)'
                    })
                } else {
                    // Add each reply received from API to replies stack
                    result.replies.forEach(replyContent => message.addReply({
                        type: 'text',
                        content: replyContent
                    }))
                }
            }

            // Send all replies
            message.reply()
                .then(() => {
                    // Do some code after sending messages
                })
                .catch(err => {
                    console.error('Error while sending message to channel', err)
                })
        })
        .catch(err => {
            console.error('Error while sending message to Recast.AI', err)
        })
}

module.exports = replyMessage