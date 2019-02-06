

function asynRead(param, callback) {
    var myFakeDataStream = param;
    var threadId = setInterval(function() {
        myFakeDataStream += 1;

        const isReady = callback(
            [data, {error: false}]
            );

        if (!isReady) {
            // Reset data and try again
            myFakeDataStream -= 1;
        }

    }, 500);
}

function asyncWriteFileToClient(req, res) {
    asynRead(req.params, function(data) {

        if(data[1].error) {
            console.log("Error in stream");
            return false;
        }else {
    
            // Daten kommen an
            // Schreibe an client
            const isReady = res.write(data[0]);
            return isReady;
        }
    });
}


function asynReadClient(param, callbackDone, client) {
    var myFakeDataStream = param;
    var threadId = setInterval(function() {
        myFakeDataStream += 1;

        const isReady = client.write(myFakeDataStream);

        if (!isReady) {
            // Reset data and try again
            myFakeDataStream -= 1;
            inpu.pause();
            //ist der resultstream wieder aufnahmefähig 
            res.once('drain', function(){
                //wird der inputstream gestartet
                inpu.resume();
            });  
        }

    }, 500);
}



var flipFlop = true;

asynRead(100, function(data) {

    if(data[1].error) {
        console.log("Error in stream");
        return false;
    }else {

        // Daten kommen an
        // Schreibe an client
        const isReady = res.write(data[0]);
        return isReady;
    }
});



class Client1() {

    write(data) {
        //Tut was
    }

}

class Client2() {

    Write(data) {
        //Tut was
    }

}

asynReadClient(100, function(data) {

    if(data[1].error) {
        console.log("Error in stream");
        return false;
    }else {

        // Daten kommen an
        // Schreibe an client
        const isReady = res.write(data[0]);
        return isReady;
    }
}, Client1);





    // DELETE
    asynRead(param.path, function(data) {

        if(data[1].error) {
            console.log("Error in stream");
            return false;
        }else {
    
            // Daten kommen an
            // Schreibe an client
            const isReady = res.write(data[0]);
            return isReady;
        }
    });

    //DELETE