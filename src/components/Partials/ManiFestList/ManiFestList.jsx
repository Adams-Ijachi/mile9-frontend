import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { ImSearch, ImDownload } from 'react-icons/im';
import _, { isEmpty, isNull } from 'lodash';
import NoEntity from '../../NoEntity';
import { TextField } from '../../FormField';
import { toast } from 'react-toastify';
import { TableLoader } from '../../Skeletons';
import { SkeletonBlock } from 'skeleton-elements/react';
import "skeleton-elements/skeleton-elements.css";
import { catchAxiosErrors, moneyFormat, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import './ManiFestList.css';

const initialFormValues = () => {
  return {
    bus_plate_number: '',
    date: '',
  };
}

const getManifestSchema = object().shape({
  bus_plate_number: string()
    .max(10, 'Too Long')
    .required('Required'),
  date: string()
    .required('Required'),
});

const ManiFestList = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [manifestArray, setManifestArray] = useState(null);

  return (
    <Fragment>
      <div className="card">
        <div className="card-body w-100">
          <Formik
            initialValues={initialFormValues()}
            validationSchema={getManifestSchema}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                const { data, status, statusText } = await postRequest(`/park_admin/fetch-manifest`, transformToFormData(values), {
                  headers: { authorization: `Bearer ${await getToken()}` }
                });

                if (data) {
                  console.log(data, status, statusText);
                  setManifestArray(_.get(data, 'manifest', []));
                  setIsLoading(false);
                  toast.success(`Record Found!`);
                }
              } catch (err) {
                catchAxiosErrors(err, setIsLoading);
              }
            }}
          >
            {props => (
              <Form>
                <div className="form__container">
                  <div className="m-0 d-flex align-items-start flex-md-row form__fields">

                    <div className="form__input mr-md-3">
                      <label htmlFor="date" className="text-label m-0 fs-6">Date</label>
                      <Field name="date" type="date" as={TextField} />
                      <ErrorMessage name="date">
                        { msg => <div className="error-msg text-danger">{msg}</div>}
                      </ErrorMessage>
                    </div>

                    <div className="form__input">
                      <label htmlFor="bus_plate_number" className="text-label m-0 fs-6">Bus Plate Number</label>
                      <Field name="bus_plate_number" type="text" as={TextField} placeholder="e.g TYY-90B980" />
                      <ErrorMessage name="bus_plate_number">
                        { msg => <div className="error-msg text-danger">{msg}</div>}
                      </ErrorMessage>
                    </div>
              
                  </div>
                  
                  <button type="submit" disabled={ (isEmpty(props.errors) && props.isValid && ((_.size(_.get(props.values, 'bus_plate_number', ''))) > 0)) ? false : true} className="btn btn-primary rounded form__btn">
                    <ImSearch className="mr-3" size={18} />
                    <span>Search</span>
                  </button>

                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      { isLoading
        ? <Fragment>
            <SkeletonBlock 
              className="bg-app-light" 
              tag="div" 
              height={150} 
              borderRadius={15} 
              effect={`fade`}
            />
            <div className="mb-3"></div>
            <TableLoader />
          </Fragment>
        : <Fragment>
            <div className="d-flex justify-content-md-between flex-md-row flex-sm-column">
              <h5 className="text-uppercase overline mb-3">Manifest List</h5>
              {(!isNull(manifestArray))
                ? <button type="button" className="btn btn-sm bg-dark-yellow">
                    <ImDownload className="mr-2" />
                    Download Manifest
                  </button>
                : ``
              }
            </div>


            <div className="mb-5">
              {(!isNull(manifestArray))
                ? manifestArray.map((manifest, index) => (
                    <div className="row">
                      <div className="col-xl-12 mb-3">
                        <div className="card">
                          <div className="card-body w-100">
                            <input type="search" className="form-control" placeholder="Search" />
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-12">
                        <div className="table-responsive">
                          <table className="table table-sm card-table display dataTablesCard rounded-xl">
                            <thead>
                              <tr>
                                <th>
                                  <div className="checkbox mr-0 align-self-center">
                                    <div className="custom-control custom-checkbox ">
                                      <input type="checkbox" className="custom-control-input" id="checkAll" required />
                                      <label className="custom-control-label" htmlFor="checkAll" />
                                    </div>
                                  </div>
                                </th>
                                <th><strong className="text-muted">S/N</strong></th>
                                <th><strong className="text-muted">Booking Date</strong></th>
                                <th><strong className="text-muted">Booking Code</strong></th>
                                <th><strong className="text-muted">Amount</strong></th>
                                <th><strong className="text-muted">Number of Seat</strong></th>
                                <th><strong className="text-muted">Start Date</strong></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr key={_.get(manifest, 'id', null)}>
                                <td>
                                  <div className="checkbox mr-0 align-self-center">
                                    <div className="custom-control custom-checkbox ">
                                      <input type="checkbox" className="custom-control-input" id="customCheckBox2" required />
                                      <label className="custom-control-label" htmlFor="customCheckBox2" />
                                    </div>
                                  </div>
                                </td>
                                <td>{index+=1}</td>
                                <td>{_.get(manifest, 'booking_date', null)}</td>
                                <td>
                                  <div className="badge badge-light">{_.get(manifest, 'booking_code', null)}</div>
                                </td>
                                <td>
                                  <div className="badge badge-danger">{moneyFormat.to(_.get(manifest, 'fare_amount', null))}</div>
                                </td>
                                <td className="text-center">
                                  <div className="badge badge-primary light">{_.get(manifest, 'seats', null)}</div>
                                </td>
                                <td>{_.get(manifest, 'leaving_date', null)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))
                : <NoEntity 
                    title={`No ManiFest At This Time`}
                    copy={`Use the search button above to get bus manifest!`}
                    imgUrl={
                      <img alt="" src="data:image/svg+xml;base64,PHN2ZyBpZD0iYjIxNjEzYzktMmJmMC00ZDM3LWJlZjAtM2IxOTNkMzRmYzVkIiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjY0Ny42MzYyNiIgaGVpZ2h0PSI2MzIuMTczODMiIHZpZXdCb3g9IjAgMCA2NDcuNjM2MjYgNjMyLjE3MzgzIj48cGF0aCBkPSJNNjg3LjMyNzksMjc2LjA4NjkxSDUxMi44MTgxM2ExNS4wMTgyOCwxNS4wMTgyOCwwLDAsMC0xNSwxNXYzODcuODVsLTIsLjYxMDA1LTQyLjgxMDA2LDEzLjExYTguMDA2NzYsOC4wMDY3NiwwLDAsMS05Ljk4OTc0LTUuMzFMMzE1LjY3OCwyNzEuMzk2OTFhOC4wMDMxMyw4LjAwMzEzLDAsMCwxLDUuMzEwMDYtOS45OWw2NS45NzAyMi0yMC4yLDE5MS4yNS01OC41NCw2NS45Njk3Mi0yMC4yYTcuOTg5MjcsNy45ODkyNywwLDAsMSw5Ljk5MDI0LDUuM2wzMi41NDk4LDEwNi4zMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNzYuMTgxODcgLTEzMy45MTMwOSkiIGZpbGw9IiNmMmYyZjIiLz48cGF0aCBkPSJNNzI1LjQwOCwyNzQuMDg2OTFsLTM5LjIzLTEyOC4xNGExNi45OTM2OCwxNi45OTM2OCwwLDAsMC0yMS4yMy0xMS4yOGwtOTIuNzUsMjguMzlMMzgwLjk1ODI3LDIyMS42MDY5M2wtOTIuNzUsMjguNGExNy4wMTUyLDE3LjAxNTIsMCwwLDAtMTEuMjgwMjgsMjEuMjNsMTM0LjA4MDA4LDQzNy45M2ExNy4wMjY2MSwxNy4wMjY2MSwwLDAsMCwxNi4yNjAyNiwxMi4wMywxNi43ODkyNiwxNi43ODkyNiwwLDAsMCw0Ljk2OTcyLS43NWw2My41ODAwOC0xOS40NiwyLS42MnYtMi4wOWwtMiwuNjEtNjQuMTY5OTIsMTkuNjVhMTUuMDE0ODksMTUuMDE0ODksMCwwLDEtMTguNzMtOS45NWwtMTM0LjA2OTgzLTQzNy45NGExNC45NzkzNSwxNC45NzkzNSwwLDAsMSw5Ljk0OTcxLTE4LjczbDkyLjc1LTI4LjQsMTkxLjI0MDI0LTU4LjU0LDkyLjc1LTI4LjRhMTUuMTU1NTEsMTUuMTU1NTEsMCwwLDEsNC40MDk2Ni0uNjYsMTUuMDE0NjEsMTUuMDE0NjEsMCwwLDEsMTQuMzIwMzIsMTAuNjFsMzkuMDQ5OCwxMjcuNTYuNjIwMTIsMmgyLjA4MDA4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik0zOTguODYyNzksMjYxLjczMzg5YTkuMDE1Nyw5LjAxNTcsMCwwLDEtOC42MTEzMy02LjM2NjdsLTEyLjg4MDM3LTQyLjA3MTc4YTguOTk4ODQsOC45OTg4NCwwLDAsMSw1Ljk3MTItMTEuMjQwMjNsMTc1LjkzOS01My44NjM3N2E5LjAwODY3LDkuMDA4NjcsMCwwLDEsMTEuMjQwNzIsNS45NzA3bDEyLjg4MDM3LDQyLjA3MjI3YTkuMDEwMjksOS4wMTAyOSwwLDAsMS01Ljk3MDcsMTEuMjQwNzJMNDAxLjQ5MjE5LDI2MS4zMzg4N0E4Ljk3Niw4Ljk3NiwwLDAsMSwzOTguODYyNzksMjYxLjczMzg5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iI2ZlNjM0ZSIvPjxjaXJjbGUgY3g9IjE5MC4xNTM1MSIgY3k9IjI0Ljk1NDY1IiByPSIyMCIgZmlsbD0iI2ZlNjM0ZSIvPjxjaXJjbGUgY3g9IjE5MC4xNTM1MSIgY3k9IjI0Ljk1NDY1IiByPSIxMi42NjQ2MiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik04NzguODE4MzYsNzE2LjA4NjkxaC0zMzhhOC41MDk4MSw4LjUwOTgxLDAsMCwxLTguNS04LjV2LTQwNWE4LjUwOTUxLDguNTA5NTEsMCwwLDEsOC41LTguNWgzMzhhOC41MDk4Miw4LjUwOTgyLDAsMCwxLDguNSw4LjV2NDA1QTguNTEwMTMsOC41MTAxMywwLDAsMSw4NzguODE4MzYsNzE2LjA4NjkxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik03MjMuMzE4MTMsMjc0LjA4NjkxaC0yMTAuNWExNy4wMjQxMSwxNy4wMjQxMSwwLDAsMC0xNywxN3Y0MDcuOGwyLS42MXYtNDA3LjE5YTE1LjAxODI4LDE1LjAxODI4LDAsMCwxLDE1LTE1SDcyMy45MzgyNVptMTgzLjUsMGgtMzk0YTE3LjAyNDExLDE3LjAyNDExLDAsMCwwLTE3LDE3djQ1OGExNy4wMjQxLDE3LjAyNDEsMCwwLDAsMTcsMTdoMzk0YTE3LjAyNDEsMTcuMDI0MSwwLDAsMCwxNy0xN3YtNDU4QTE3LjAyNDExLDE3LjAyNDExLDAsMCwwLDkwNi44MTgxMywyNzQuMDg2OTFabTE1LDQ3NWExNS4wMTgyOCwxNS4wMTgyOCwwLDAsMS0xNSwxNWgtMzk0YTE1LjAxODI4LDE1LjAxODI4LDAsMCwxLTE1LTE1di00NThhMTUuMDE4MjgsMTUuMDE4MjgsMCwwLDEsMTUtMTVoMzk0YTE1LjAxODI4LDE1LjAxODI4LDAsMCwxLDE1LDE1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik04MDEuODE4MzYsMzE4LjA4NjkxaC0xODRhOS4wMTAxNSw5LjAxMDE1LDAsMCwxLTktOXYtNDRhOS4wMTAxNiw5LjAxMDE2LDAsMCwxLDktOWgxODRhOS4wMTAxNiw5LjAxMDE2LDAsMCwxLDksOXY0NEE5LjAxMDE1LDkuMDEwMTUsMCwwLDEsODAxLjgxODM2LDMxOC4wODY5MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNzYuMTgxODcgLTEzMy45MTMwOSkiIGZpbGw9IiNmZTYzNGUiLz48Y2lyY2xlIGN4PSI0MzMuNjM2MjYiIGN5PSIxMDUuMTczODMiIHI9IjIwIiBmaWxsPSIjZmU2MzRlIi8+PGNpcmNsZSBjeD0iNDMzLjYzNjI2IiBjeT0iMTA1LjE3MzgzIiByPSIxMi4xODE4NyIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==" />
                    }
                  />
              }
            </div>
          </Fragment>
      }
    </Fragment>
  );
}

export default ManiFestList;
