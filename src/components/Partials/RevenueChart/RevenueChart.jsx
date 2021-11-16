import { Fragment } from 'react';
import { Line } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { withAdminRevenueQuery } from '../../../recoil/parkAdminRevenue';
import './RevenueChart.css';

const RevenueChart = () => {

  const revenueData = useRecoilValue(withAdminRevenueQuery);
  console.log(revenueData);

  const months = Array.from({ length: 12 }, (item, i) => {
    return new Date(0, i).toLocaleDateString('en-US', { month: 'long' });
  })

  const chartData = {
    labels: months,
    datasets: [{
      label: 'Park Revenue',
      data: [revenueData],
      borderColor: 'rgb(254, 99, 78)',
      backgroundColor: 'rgb(255, 211, 205)',
      fill: true,
      spanGaps: true,
      tension: 0.5,
    }]
  }
  return (
    <Fragment>
      <div className="card" id="sales-revenue">
        <div className="card-header pb-0 d-block d-sm-flex border-0">
          <h3 className="fs-20 text-black mb-0">Sales Revenue</h3>
          <div className="card-action revenue-tabs mt-3 mt-sm-0">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#monthly" role="tab" aria-selected="false">
                  Monthly
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#weekly" role="tab" aria-selected="false">
                  Weekly
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#today" role="tab" aria-selected="true">
                  Daily
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card-body">
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active w-100" id="user" role="tabpanel">
              <Line data={chartData} options={{
                responsive: true,
                animations: {
                  tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0.5,
                    loop: true
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    }   
                  },
                },
              }} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default RevenueChart;
