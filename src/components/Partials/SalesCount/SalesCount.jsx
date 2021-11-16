import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import { withSalesCountQuery } from '../../../recoil/parkSalesCount';
import { Bar } from 'react-chartjs-2';
import './SalesCount.css';

const SalesCount = () => {

  const salesCount = useRecoilValue(withSalesCountQuery);

  const salesData = {
    labels: ['Cumulative Sales'],
    datasets: [
      {
        label: 'Sales Count',
        data: [salesCount],
        backgroundColor: [
          'rgb(254, 99, 78)',
        ],
        hoverOffset: 4
      }
    ]
  }

  return (
    <Fragment>
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-end">
            <div>
              <p className="fs-14 mb-1">Park Sales</p>
              <span className="fs-35 text-black font-w600">{salesCount && salesCount}</span>
            </div>
          </div>
          <div className="chart__container">
            <Bar data={salesData} options={{
              responsive: true
            }} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SalesCount;
