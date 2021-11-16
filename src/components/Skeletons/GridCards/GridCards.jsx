import { Fragment } from 'react'
import { SkeletonBlock } from 'skeleton-elements/react';
import PropTypes from 'prop-types';
import "skeleton-elements/skeleton-elements.css";

const GridCards = ({ cardHeight, cardRadius, cardEffect, gridSize }) => {
  return (
    <Fragment>
      <div className="row mb-5">
        <div className={`col-sm-12 ${(gridSize) ? gridSize : 'col-md-4'} mb-3`}>
          <SkeletonBlock className="bg-app-light" tag="div" height={cardHeight} borderRadius={cardRadius} effect={cardEffect} />
        </div>
        <div className={`col-sm-12 ${(gridSize) ? gridSize : 'col-md-4'} mb-3`}>
          <SkeletonBlock className="bg-app-light" tag="div" height={cardHeight} borderRadius={cardRadius} effect={cardEffect} />
        </div>
        <div className={`col-sm-12 ${(gridSize) ? gridSize : 'col-md-4'} mb-3`}>
          <SkeletonBlock className="bg-app-light" tag="div" height={cardHeight} borderRadius={cardRadius} effect={cardEffect} />
        </div>
        <div className={`col-sm-12 ${(gridSize) ? gridSize : 'col-md-4'} mb-3`}>
          <SkeletonBlock className="bg-app-light" tag="div" height={cardHeight} borderRadius={cardRadius} effect={cardEffect} />
        </div>
        <div className={`col-sm-12 ${(gridSize) ? gridSize : 'col-md-4'} mb-3`}>
          <SkeletonBlock className="bg-app-light" tag="div" height={cardHeight} borderRadius={cardRadius} effect={cardEffect} />
        </div> 
        <div className={`col-sm-12 ${(gridSize) ? gridSize : 'col-md-4'} mb-3`}>
          <SkeletonBlock className="bg-app-light" tag="div" height={cardHeight} borderRadius={cardRadius} effect={cardEffect} />
        </div>      
      </div>
    </Fragment>
  );
}

GridCards.propTypes = {
  cardHeight: PropTypes.number,
  cardRadius: PropTypes.number,
  cardEffect: PropTypes.string,
}

export default GridCards;
