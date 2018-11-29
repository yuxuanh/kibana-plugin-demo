import exampleRoute from './server/routes/example';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'demo',
    uiExports: {
      
      app: {
        title: 'Demo',
        description: 'demo user picture',
        main: 'plugins/demo/app'
      },
      
      
      hacks: [
        'plugins/demo/hack'
      ]
      
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    
    init(server, options) {
      // Add server routes and initialize the plugin here
      exampleRoute(server);
    }
    

  });
};
