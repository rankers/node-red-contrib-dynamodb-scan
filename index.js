module.exports = function(RED) {
    var util = require("util");
    var aws = require("aws-sdk");
    var attrWrapper = require("dynamodb-data-types").AttributeValue;

    function DDBInNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.region = n.region || "us-east-1";
        node.table = n.table;

        aws.config.update({
            accessKeyId: node.credentials.accessKey,
            secretAccessKey: node.credentials.secretAccessKey,
            region: node.region
        });

        var ddb = new aws.DynamoDB.DocumentClient();

        node.on("input", function(msg) {
            queryTable(msg.payload)
        });

        // Expects:
        // {
        //  key: "nme",
        //  reservedKey: "name",
        //  value: true,
        //  operator: "="
        // }
        // Just one key / value at the moment
        function queryTable(args){
            var key = "#" + args.key;
            var reservedKey = args.reservedKey
            var value = args.value;
            var operator = args.operator;
            var expressionAttributeNames = {}
            expressionAttributeNames[key] = reservedKey

            var expressionAttributeValues = {}
            expressionAttributeValues[":value"] = value

            var params = {
                TableName: n.table,
                FilterExpression: key + " " + operator + " :value",
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues
            };

            ddb.scan(params, function(err,data){
                if(err){
                    console.error(err, err.stack);
                } else {
                    sendData(n.table, data)
              }
          });
        };

        var sendData = function (topic, payload) {
            var msg = {
                topic: topic,
                payload: payload
            };
            node.send(msg);
        };
    }

    RED.nodes.registerType("ddb-in", DDBInNode, {
        credentials: {
            accessKey: { type:"text" },
            secretAccessKey: { type: "password" }
        }
    });
};