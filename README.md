# node-red-contrib-dynamodb-scan

Wrap aws sdk dynamo db scan functionality.

## Usage 

*Input*

Payload input expects key, reservedKey, value and operator. Reserved keys such as `year` or `name` need to be substitued with a key that isn't reserved.

    {
        key: "nme",
        reservedKey: "name",
        value: true,
        operator: "="
    }

*Output*

Response from asw-sdk passed directly to msg.payload. 

* `Items` - response array.
* `Count` - number of items returned
* `Scanned Count` - number of items scanned.

*Example*

    {
        "Items": [
            { 
                "name": "John"
            }
        ],
        "Count": 1,
        "ScannedCount": 4
    }


## Todo

* Multiple scan parameters
* Default to `key` if reserved key isn't present or could even accept just `key` and always provide a substition for the reserved key. i.e. pass in `name` and substitue with `name_reserved_key`. 
