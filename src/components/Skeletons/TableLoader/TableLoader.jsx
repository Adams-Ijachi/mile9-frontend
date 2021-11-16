import { Fragment } from 'react'
import { SkeletonBlock, SkeletonText } from 'skeleton-elements/react';
import "skeleton-elements/skeleton-elements.css";
import './TableLoader.css';

const TableLoader = () => {
  return (
    <Fragment>
      <div className="w-100 table__loader mb-5">
        <SkeletonBlock className="bg-app-light mb-1 shadow-hover shadow-sm" height={55} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mb-1" height={40} effect={"fade"} />
        <SkeletonBlock className="bg-app-light mt-1" height={55} effect={"fade"} />
      </div>
    </Fragment>
  );
}

export default TableLoader;
