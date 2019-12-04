import React from 'react';
import { connect } from 'react-redux';
import VideoEdit from './components/VideoEdit'


function App() {
  return (
    
      <div>
        <header >
          <h1>Hello you</h1>
          <VideoEdit/>
        </header>
      </div>

  );
}

const mapStateToProps = (state, ownProps) => ({
  
});

export default connect(mapStateToProps)(App);

