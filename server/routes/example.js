export default function (server) {
  const {callWithRequest} = server.plugins.elasticsearch.getCluster('data');
  server.route({
    path: '/api/test/{example}',
    method: 'GET',
    handler(req, reply) {
    	callWithRequest(req, 'get', {
    		index: 'prd_mi_info_user_attri',
    		type: 'doc',
    		id: req.params.example
    	}).then(function(response){
    		reply(response);
      	//reply({ time: (new Date()).toISOString() });
    	}).error(function(response){
    		reply({"_source":{"custSeg":"error","hasDebitCard":"error"}})
    	});
    }
  });

}
