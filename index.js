module.exports = function(RED) {
    var util = require("util");
    var aws = require("aws-sdk");
    var attrWrapper = require("dynamodb-data-types").AttributeValue;

    function DDBInNode(n) {
        RED.nodes.createNode(this, n);
        this.region = n.region || "us-east-1";
        this.table = n.table;

        aws.config.update({ accessKeyId: this.credentials.accessKey,
            secretAccessKey: this.credentials.secretAccessKey,
            region: this.region });

        var ddb = new aws.DynamoDB();

        var sendData = function (topic, payload) {

            console.log(topic, payload);
            
            var msg = {
                topic: topic,
                payload: payload
            };
            node.send(msg);
        };

        var params = {
            TableName: n.table,
            ProjectionExpression: "user_id, device_token",
            FilterExpression: "is_employee = :bool",
            ExpressionAttributeValues: {
                ":bool":true
            }
        };

        docClient.scan(params, function(err,data){
            if(err){
                console.error(err, err.stack);
            } else {
                sendData(n.table, data)
          }
      });
    }

    RED.nodes.registerType("ddb in", DDBInNode, {
        credentials: {
            accessKey: { type:"text" },
            secretAccessKey: { type: "password" }
        }
    });
};