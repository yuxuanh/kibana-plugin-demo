export default function (server) {
  const {callWithRequest} = server.plugins.elasticsearch.getCluster('data');
  server.route({
    path: '/api/test/{example}',
    method: 'GET',
    handler(req, reply) {
    	callWithRequest(req, 'get', {
    		index: 'prd_mi_hub_user_attri',
    		type: 'doc',
    		id: req.params.example
    	}).then(function(response){
    		reply(response);
      	//reply({ time: (new Date()).toISOString() });
    	}).error(function(response){
    		reply({"_source":{"error":"y"}})
    	});
    }
  });

  server.route({
    path: '/api/logon/{example}',
    method: 'GET',
    handler(req, reply) {
      callWithRequest(req, 'search', {
        index: 'user_logon_tagging',
        q: 'custid:'+req.params.example
      }).then(function(response){
        reply(response);
        //reply({ time: (new Date()).toISOString() });
      }).error(function(response){
        reply({"hits":{"hits":[{"_source":{"error":"y"}}]}})
      });
    }
  });

  server.route({
    path: '/api/trans/{example}',
    method: 'GET',
    handler(req, reply) {
      callWithRequest(req, 'search', {
        index: 'user_trans_tagging',
        q: 'custid:'+req.params.example
      }).then(function(response){
        reply(response);
        //reply({ time: (new Date()).toISOString() });
      }).error(function(response){
        reply({"hits":{"hits":[{"_source":{"error":"y"}}]}})
      });
    }
  });
}
