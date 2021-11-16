import { Fragment, forwardRef, lazy, Suspense } from 'react';

const AppBrand = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/AppBrand'));
const MiniFooter = lazy(() => import(/* webpackChunkName: "Footer" */ '../../components/core/MiniFooter'));
const AgentMiniHeader = lazy(() => import(/* webpackChunkName: "Header" */ '../../components/core/AgentMiniHeader'));
const AgentSideBar = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/AgentSideBar'));

const AgentLayout = forwardRef(({ children }, ref) => (
  <Fragment>
    <div ref={ref} id="main-wrapper">
      <Suspense fallback={<div>Brand...</div>}>
        <AppBrand />
      </Suspense>

      <Suspense fallback={<div>Header...</div>}>
        <AgentMiniHeader />
      </Suspense>

      <Suspense fallback={<div>Sidebar...</div>}>
        <AgentSideBar />
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

export default AgentLayout;
