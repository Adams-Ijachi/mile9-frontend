import { Fragment } from 'react';
import PropTypes from 'prop-types';
import './NoEntity.css'
import 'animate.css';

const NoEntity = ({ imgUrl, title, copy }) => {
  return (
    <Fragment>
      <div className="container w-100 animate__animated animate__fadeIn">
        <h4 className="text-center fs-4 m-0 mb-4">{title && title}</h4>

        <div className="d-flex justify-content-center">
          <div className="img-container">
            {imgUrl && imgUrl}
          </div>
        </div>

        <div className="mt-4 w-100">
          <p className="m-0 text-center fs-5">{copy && copy}</p>
        </div>
      </div>
    </Fragment>
  );
}

NoEntity.propTypes = {
  imgUrl: PropTypes.object,
  title: PropTypes.string,
  copy: PropTypes.string,
}

export default NoEntity;
