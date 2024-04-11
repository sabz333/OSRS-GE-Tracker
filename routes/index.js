import home from '../controllers/home.js';
import item from '../controllers/item.js';
import headers from '../controllers/headers.js';
import search from '../controllers/search.js';
import graph from '../controllers/graph.js';

const mountRoutes = (app) => {
  app.use('/', home);
  app.use('/item', item);
  app.use('/headers', headers);
  app.use('/search', search);
  app.use('/graph', graph);
}

export default mountRoutes;