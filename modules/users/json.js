module.exports = function json(res,err,result) {
    if(err){
        switch(result){
            case "Server Error":
                res.status(500).jsonp({error:result});
                break;
            default:
                res.jsonp({
                    error: true,
                    result: result
                });
        }
    }
    else{
        res.jsonp({
            error:false,
            result:result
        });
    }
}



