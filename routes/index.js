import home from '../controllers/home.js';
import item from '../controllers/item.js';
import headers from '../controllers/headers.js';
import search from '../controllers/search.js';
import graph from '../controllers/graph.js';
import login from '../controllers/login.js';
import auth from '../controllers/auth.js';
import dashboard from '../controllers/dashboard.js';

const mountRoutes = (app) => {
  app.use('/', home);
  app.use('/item', item);
  app.use('/headers', headers);
  app.use('/search', search);
  app.use('/graph', graph);
  app.use('/login', login);
  app.use('/auth', auth);
  app.use('/dashboard', dashboard);
}

export default mountRoutes;