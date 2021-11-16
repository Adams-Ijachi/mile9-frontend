import { Fragment, forwardRef, lazy, Suspense } from 'react';

const MiniHeader = lazy(() => import(/* webpackChunkName: "Header" */ '../../components/core/MiniHeader'));
const MiniFooter = lazy(() => import(/* webpackChunkName: "Footer" */ '../../components/core/MiniFooter'));
const AppBrand = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/AppBrand'));
const SideBar = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/SideBar'));

const AppLayout = forwardRef(({ children }, ref) => (
  <Fragment>
    <div ref={ref} id="main-wrapper">
      <Suspense fallback={<div>Brand...</div>}>
        <AppBrand />
      </Suspense>

      <Suspense fallback={<div>Header...</div>}>
        <MiniHeader />
      </Suspense>

      <Suspense fallback={<div>Sidebar...</div>}>
        <SideBar />
      </Suspense>
      
      
      <div className="content-body">
        <div className="container-fluid">
          {children}
        </div>
      </div>
      
      <Suspense fallback={<div>Footer...</div>}>
        <MiniFooter className="footer" />
      </Suspense>
    </div>
  </Fragment>
));


export default AppLayout

