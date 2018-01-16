//不可用
var oracledb = require('oracledb');

oracledb.getConnection({
    user          : "chsiaccount",
    password      : "chsitest",
    connectString : "172.16.1.97:1521:ora9/"
},function(err, connection){
    if (err) {
        console.error(err.message);
        return;
    }
    connection.execute(
        "SELECT * FROM MONITOR_PAGE_LIST ",
        function(err, result) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(result);
        });
});