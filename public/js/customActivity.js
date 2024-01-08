define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var lastStepEnabled = false;
    var steps = [{ "label": "Configure Postcard", "key": "step1" }];
    var schemadata = {};
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedSchema', handelSchema)
    //connection.on('requestedInteraction', onRequestedInteraction);
    //connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    //connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestSchema')
        //connection.trigger('requestInteraction');
        //connection.trigger('requestTriggerEventDefinition');
        //connection.trigger('requestDataSources');  

    }
    $(document).on('click', '#done', function (event) {
        save();
        parseUserConfig();
    });

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    // function handelSchema(schema) {
    //     console.log('*** Schema ***', JSON.stringify(schema));

    // }

    function handelSchema(schema) {
            console.log("####Schema without strignify#####", schema);
            console.log('*** Schema ***', JSON.stringify(schema))
            schemadata = schema;
            parsePrimary();

            // var getattributes = [];
            reloadUserConfig();
        }

        function parsePrimary() {
            const schema = schemadata.schema;
            const primaryKeyObj = ((schema || []).filter(s => s.isPrimaryKey))[0];
            if (primaryKeyObj) {
                dataExtensionPrimaryKey = primaryKeyObj.name;
            }
        }

        // function reloadUserConfig() {
        //     const hasInArguments = Boolean(
        //         payload['arguments'] &&
        //         payload['arguments'].execute &&
        //         payload['arguments'].execute.inArguments &&
        //         payload['arguments'].execute.inArguments.length > 0
        //     );
        //     const inArguments = hasInArguments ? payload['arguments'].execute.inArguments : [];
        //     const hasUserConfig = inArguments[0].userConfig && inArguments[0].userConfig.length;

        //     if (useDEColumnForWaitTime) {
        //         if (!hasInArguments || !(inArguments[0].activityInfo && inArguments[0].activityInfo.waitTimeColumnName)) {
        //             $('#wait-time-col').css('display', 'none');
        //             createWaitTimeDECol().then(res => {
        //                 $('#wait-time-col').css('display', 'inline');
        //                 $('#wait-time-col').attr('title', waitTimeColumnName);
        //             });
        //         } else {
        //             waitTimeColumnName = inArguments[0].activityInfo.waitTimeColumnName;
        //             $('#wait-time-col').css('display', 'inline');
        //             $('#wait-time-col').attr('title', waitTimeColumnName);
        //         }
        //     } else {
        //         $('#wait-time-col').css('display', 'none');
        //     }

        //     if (!hasInArguments || !hasUserConfig) {
        //         addGroup();
        //         updateUIDropdownsWithSchema();
        //         return;
        //     }


        //     $.each(inArguments, function (index, inArgument) {
        //         const userConfigs = inArgument.userConfig || [];
        //         $.each(userConfigs, function (index, userConfig) {
        //             const dynamicAttLength = (userConfig.dynamicAttributes || []).length || 1;
        //             addGroup(dynamicAttLength);
        //         })
        //     });

        //     /* update UI dropdowns from schema */
        //     updateUIDropdownsWithSchema();


        //     /* based on the payload config, repopulate the UI */
        //     $.each(inArguments, function (index, inArgument) {
        //         const userConfigs = inArgument.userConfig || [];

        //         $.each(userConfigs, function (index, userConfig) {
        //             console.log({index, userConfig});
        //             let pos = index + 1;

        //             /* populate the values */
        //             let dynamicAttributes = userConfig.dynamicAttributes || [];
        //             for (let [i, dynamicAttribute] of dynamicAttributes.entries()) {
        //                 $(`#dynamicAttribute-${pos} .attribute-select`).eq(i).val(dynamicAttribute.property);
        //                 $(`#dynamicAttribute-${pos} .operator-select`).eq(i).val(dynamicAttribute.operator);
        //                 $(`#dynamicAttribute-${pos} .operand-input`).eq(i).val(dynamicAttribute.operand);
        //             }
        //         });
        //     });
        // }    
        


    
    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
               if (key === 'postcardURL') {
                    $('#postcard-url').val(val);
                    $('.postcard - preview - content').css('background - image', "url('" + $('#postcard-url').val()); 
                }

                if (key === "postcardText")
                    $('#postcard-text').val(val);
                    $('#postcard-preview-text').html($('#postcard - text').val());
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        console.log("save called now");
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();
        const throttleData = [];

        const rows = document.querySelectorAll('.domainDiv');
        console.log("aaaaaaaaaaaaaaaaaaaa", rows);

  rows.forEach((row, index) => {
    console.log("row here 11111111111111111111", row);
    const domainSelect = row.querySelector(`#domain`);
    console.log("domain", domain);

    const maxInput = row.querySelector(`#max${index + 1}`);
    console.log("maxInput", maxInput);
    const durationSelect = row.querySelector(`#duration${index + 1}`);
    console.log("durationSelect", durationSelect);

    const domainValue = domainSelect.value;
    const maxValue = maxInput.value;
    const durationValue = durationSelect.value;

    console.log("aaaaaaaaaaaaa values aaaaaaaaa", domainValue, maxValue, durationValue);

    // Check if all values are present before adding to JSON
    if (domainValue && maxValue && durationValue) {
      const rowData = {
        domain: domainValue,
        max: maxValue,
        duration: durationValue,
      };

      throttleData.push(rowData);
    }
  });

  console.log("throttleData", throttleData);

  console.log(JSON.stringify(throttleData));

        // payload['arguments'].execute.inArguments = [{
        //     "tokens": authTokens,
        //     "postcardText": postcardTextValue,
        //     "postcardURL":postcardURLValue
        // }];
        
        // payload['metaData'].isConfigured = true;

        fetch('http://localhost:3000/journeybuilder/save/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Set the appropriate content type for your API
              // Add any other headers if needed
            },
            body: JSON.stringify(throttleData),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); // or response.text() or other methods based on your API response type
            })
            .then(data => {
              // Handle the successful response
              console.log('API Response:', data);
            })
            .catch(error => {
              // Handle errors
              console.error('API Error:', error);
            });

            console.log(payload);
        connection.trigger('updateActivity', payload);
    }

    $('#btn-preview').click(function () {
        $('#postcard-preview-text').html($('#postcard-text').val());
        $('.postcard-preview-content').css('background-image',"url('" + $('#postcard-url').val() + "')");
    });

});
