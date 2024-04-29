import React from 'react';
import Game from '../Game/Game';
import Results from '../Results/Results';
import {
  createBrowserRouter,
  Route,
  RouterProvider
} from 'react-router-dom'
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import ErrorPage from '../../error_pages/error_page';


const router = createBrowserRouter([
  {
    path:'/',
    element:<Game/>,
    errorElement: <ErrorPage/>,
  },
  {
    path:'/results',
    element: <Results/>,
    errorElement: <ErrorPage/>,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;