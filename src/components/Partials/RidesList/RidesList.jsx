import { isEmpty, findIndex } from 'lodash';
import { Fragment, useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number } from 'yup';
import { TiEdit } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loading-icons';
import { toast } from 'react-toastify';
import NoEntity from '../../NoEntity';
import { catchAxiosErrors, getToken, moneyFormat, transformToFormData } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { TextField } from '../../FormField';
import './RidesList.css';
import 'animate.css';
import parkRidesAtom, { withParkRidesQuery } from '../../../recoil/parkRides';

const InitialFormData = (ride) => {
  return {
    starting_point: ride?.starting_point,
    destination: ride?.destination,
    price: ride?.price,
    ride_description: ride?.ride_description,
  };
}

const updateRideSchema = object().shape({
  starting_point: string()
    .min(3, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
  destination: string()
    .min(3, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
  price:number()
    .min(1, 'Invalid Price')
    .required('Required'),
  ride_description: string()
    .min(10, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
});

export const RideModalFooter = ({ values, isValid, errors, ride, modalID }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkRides, setParkRides] = useRecoilState(parkRidesAtom);

  useEffect(() => {
    console.log('new values:', values, isValid);
  }, [values]);

  const updateState = (rId) => {
    const index = findIndex(parkRides, (o) => o.id === rId);
    const rideData = parkRides[index];

    if (index === -1) {
      console.log('no match')
    } else {
      setParkRides([
        ...parkRides.slice(0, index), 
        rideData, 
        ...parkRides.slice(index+1)
      ]);
    }
  }

  const updateParkRide = async (rideId) => {
    try {
      setIsLoading(true);

      const { data, status, statusText } = await postRequest(`/park_admin/update-ride/${rideId}`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        toast.success(`Updated Successfully!`);
        updateState(rideId);
        setIsLoading(false);
        setTimeout(() => {
          document.getElementById(`${modalID}`).click();
        }, 100);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }
  
  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button id="close_update_ride_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={() => updateParkRide(ride?.id)} type="button" disabled={(isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Update</button>
        }
      </div>
    </Fragment>
  );
} 

export const RidesTableActions = ({ uid, loaderId, ride }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parkRides, setParkRides] = useRecoilState(parkRidesAtom);

  console.log('Ride=>', ride);
  console.log('From Remove Component: ', parkRides);

  const removeParkRide = async (rideId) => {
    try {
      setIsLoading(true);

      const { data, status, statusText } = await postRequest(`/park_admin/delete-ride/${rideId}`, null, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        setParkRides(parkRides.filter(ride => ride?.id !== rideId));
        toast.success(`Deleted Ride Successfully!`);
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading);
    }
  }

  return (
    <Fragment>
      <div id={uid} className="d-flex align-items-center">
        <span data-toggle="modal" data-target={`#exampleUpdateRideModal${uid}`} id={`${uid}${loaderId}`} className="pointer pointer-scale mr-4">
          <i><TiEdit className="text-secondary" size={"25px"} /></i>
        </span>

        {/* Update Modal*/}
        <div className="modal fade" tabIndex={-1} id={`exampleUpdateRideModal${uid}`} name={`${uid}${loaderId}`}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Park Ride</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <AiOutlineCloseCircle />
                </button>
              </div>

              <div className="modal-body">
                <Formik
                  initialValues={InitialFormData(ride)}
                  validationSchema={updateRideSchema}
                >
                  {props => (
                    <Form>
                      <div className="row">
                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="starting_point" className="text-label fs-6 m-0">Starting Point</label>
                          <Field name="starting_point" type="text" as={TextField} placeholder="e.g Lagos" />
                          <ErrorMessage name="starting_point">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="destination" className="text-label fs-6 m-0">Destination</label>
                          <Field name="destination" type="text" as={TextField} placeholder="e.g Lagos" />
                          <ErrorMessage name="destination">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="price" className="text-label fs-6 m-0">Price</label>
                          <Field name="price" type="number" as={TextField} placeholder="e.g Lagos" />
                          <ErrorMessage name="price">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="ride_description" className="text-label fs-6 m-0">Ride Description</label>
                          <Field name="ride_description" type="text" as={TextField} placeholder="e.g Lagos" />
                          <ErrorMessage name="ride_description">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>
                      <RideModalFooter 
                        values={props.values}
                        isValid={props.isValid}
                        errors={props.errors}
                        ride={ride}
                        modalID={`exampleUpdateRideModal${uid}`}
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

          </div>
        </div>
        {/* Update Modal*/}

        { isLoading
          ? <span id={loaderId} className="mr-4">
              <ThreeDots className="animate__animated animate__pulse" fill={"#FE634E"} height={"1rem"} width={"1.8rem"} />
            </span>
          : <span onClick={() => removeParkRide(ride.id)} className="pointer pointer-scale mr-4">
              <i><RiDeleteBin6Line className="text-primary" size={"25px"} /></i>
            </span>
        }
      </div>
    </Fragment>
  );
}
const RidesList = () => {
  const ridesArray = useRecoilValue(withParkRidesQuery);
  const [parkRides, setParkRides] = useRecoilState(parkRidesAtom);

  console.log('Rides Array:', ridesArray);
  console.log('Local State Atom:', parkRides);

  return (
    <Fragment>
      {(!isEmpty(ridesArray))
        ? <div className="row">
            <div className="col-xl-12">
              <div className="table-responsive">
                <table className="table card-table display dataTablesCard rounded-xl">
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
                      <th><strong className="text-muted">Starting Point</strong></th>
                      <th><strong className="text-muted">Destination</strong></th>
                      <th><strong className="text-muted">Price</strong></th>
                      <th><strong className="text-muted">Description</strong></th>
                      <th><strong className="text-muted">Actions</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ridesArray.map((ride, index) => (
                      <tr key={ride?.id}>
                        <td>
                          <div className="checkbox mr-0 align-self-center">
                            <div className="custom-control custom-checkbox ">
                              <input type="checkbox" className="custom-control-input" id="customCheckBox2" required />
                              <label className="custom-control-label" htmlFor="customCheckBox2" />
                            </div>
                          </div>
                        </td>
                        <td>{index+=1}</td>
                        <td>{ride?.starting_point}</td>
                        <td>{ride?.destination}</td>
                        <td>
                          <span className="badge badge-primary">{moneyFormat.to(ride?.price)}</span>
                        </td>
                        <td>{ride?.ride_description}</td>
                        <td>
                          <RidesTableActions uid={`action${ride?.id}`} loaderId={`btn${index}${ride?.id}`} ride={ride} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        : <NoEntity title={"No Rides At This Time"} copy={"Goto the Rides page in other to create new rides."}
            imgUrl={<img alt="no-rides" src="data:image/svg+xml;base64,PHN2ZyBpZD0iZTA5NTgxNjktNjFjZS00OWM5LThmMmEtNWUzYTgxZmM1MGU4IiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9Ijg4Ni4zNTEyNSIgaGVpZ2h0PSI0OTEuNjMxMTQiIHZpZXdCb3g9IjAgMCA4ODYuMzUxMjUgNDkxLjYzMTE0Ij48dGl0bGU+bmF2aWdhdG9yPC90aXRsZT48Y2lyY2xlIGN4PSIyMzIuMzk1ODkiIGN5PSIxMDMuMjQ2MzUiIHI9IjUwLjc2MjY3IiBmaWxsPSIjZmY2NTg0Ii8+PHBhdGggZD0iTTU0OC40MDYzMyw0NjMuODYyNjlIMjk5LjM3OTg5YTUuMDc5NDEsNS4wNzk0MSwwLDAsMS0uOTMwNTktLjA3MzczTDQxNi4yMjczNSwyNTkuNzgwNDRhOC4yNDY0OSw4LjI0NjQ5LDAsMCwxLDE0LjM1NDg3LDBMNTA5LjYyNjA3LDM5Ni42ODZsMy43ODY4NSw2LjU1MDk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iMzkxLjU4MiAyNTkuNjc4IDMwNi41NTggMjU5LjY3OCAzNDguMjk2IDE5OS4wNTIgMzUxLjMgMTk0LjY4NSAzNTIuODAyIDE5Mi41MDIgMzU2LjU4OSAxOTkuMDUyIDM5MS41ODIgMjU5LjY3OCIgb3BhY2l0eT0iMC4yIi8+PHBhdGggZD0iTTY4Ny4wNjI0Nyw0NjMuODYyNjlINDcxLjY3NTA2bDQxLjczNzg2LTYwLjYyNTc4LDMuMDAzNi00LjM2NzMxLDU0LjM4ODE4LTc5LjAwN2MzLjU2NTY3LTUuMTc4MDcsMTIuMTQzNTctNS41MDA1MiwxNi4zMzU3Ny0uOTc2NjVhOS44Mjk5NCw5LjgyOTk0LDAsMCwxLC43ODMyLjk3NjY1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0iIzNmM2Q1NiIvPjxjaXJjbGUgY3g9IjU5My40NjMzMiIgY3k9IjIxMC44MTk4MiIgcj0iMTUuMjk2NDkiIGZpbGw9IiNmZTYzNGUiLz48cG9seWdvbiBwb2ludHM9IjU5NC45MzggMjU2Ljg5NCA1OTEuODA1IDI1Ni44OTQgNTkzLjIzMyAyMDguNTE2IDU5NC45MzggMjU2Ljg5NCIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iNTkzLjUwOSAyMTcuNjg1IDU5Ni44NzMgMjEzLjAzMSA1OTMuNDYzIDIxOC44MzcgNTkzLjA5NSAyMTguMTkyIDU5My41MDkgMjE3LjY4NSIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iNTkzLjE0MSAyMjIuMzg0IDU4OS43NzcgMjE3LjczMSA1OTMuMTg3IDIyMy41MzYgNTkzLjU1NSAyMjIuODkxIDU5My4xNDEgMjIyLjM4NCIgZmlsbD0iIzNmM2Q1NiIvPjxjaXJjbGUgY3g9IjczMy43ODAwNSIgY3k9IjIxMC44MTk4MiIgcj0iMTUuMjk2NDkiIGZpbGw9IiNmZTYzNGUiLz48cG9seWdvbiBwb2ludHM9IjczNS4yNTQgMjU2Ljg5NCA3MzIuMTIxIDI1Ni44OTQgNzMzLjU1IDIwOC41MTYgNzM1LjI1NCAyNTYuODk0IiBmaWxsPSIjM2YzZDU2Ii8+PHBvbHlnb24gcG9pbnRzPSI3MzMuODI2IDIxNy42ODUgNzM3LjE5IDIxMy4wMzEgNzMzLjc4IDIxOC44MzcgNzMzLjQxMSAyMTguMTkyIDczMy44MjYgMjE3LjY4NSIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iNzMzLjQ1OCAyMjIuMzg0IDczMC4wOTQgMjE3LjczMSA3MzMuNTA0IDIyMy41MzYgNzMzLjg3MiAyMjIuODkxIDczMy40NTggMjIyLjM4NCIgZmlsbD0iIzNmM2Q1NiIvPjxjaXJjbGUgY3g9IjYzNy43NzQ1NSIgY3k9IjE4OC44NDY0NiIgcj0iMjIuNTkxNjQiIGZpbGw9IiNmZTYzNGUiLz48cG9seWdvbiBwb2ludHM9IjYzOS45NTIgMjU2Ljg5NCA2MzUuMzI1IDI1Ni44OTQgNjM3LjQzNCAxODUuNDQ0IDYzOS45NTIgMjU2Ljg5NCIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iNjM3Ljg0MyAxOTguOTg1IDY0Mi44MSAxOTIuMTEzIDYzNy43NzUgMjAwLjY4NyA2MzcuMjMgMTk5LjczNCA2MzcuODQzIDE5OC45ODUiIGZpbGw9IiMzZjNkNTYiLz48cG9seWdvbiBwb2ludHM9IjYzNy4yOTggMjA1LjkyNiA2MzIuMzMxIDE5OS4wNTQgNjM3LjM2NiAyMDcuNjI3IDYzNy45MTEgMjA2LjY3NSA2MzcuMjk4IDIwNS45MjYiIGZpbGw9IiMzZjNkNTYiLz48Y2lyY2xlIGN4PSI2OTIuODY4MjMiIGN5PSIxODguODQ2NDYiIHI9IjIyLjU5MTY0IiBmaWxsPSIjZmU2MzRlIi8+PHBvbHlnb24gcG9pbnRzPSI2OTUuMDQ2IDI1Ni44OTQgNjkwLjQxOSAyNTYuODk0IDY5Mi41MjggMTg1LjQ0NCA2OTUuMDQ2IDI1Ni44OTQiIGZpbGw9IiMzZjNkNTYiLz48cG9seWdvbiBwb2ludHM9IjY5Mi45MzYgMTk4Ljk4NSA2OTcuOTA0IDE5Mi4xMTMgNjkyLjg2OCAyMDAuNjg3IDY5Mi4zMjQgMTk5LjczNCA2OTIuOTM2IDE5OC45ODUiIGZpbGw9IiMzZjNkNTYiLz48cG9seWdvbiBwb2ludHM9IjY5Mi4zOTIgMjA1LjkyNiA2ODcuNDI0IDE5OS4wNTQgNjkyLjQ2IDIwNy42MjcgNjkzLjAwNCAyMDYuNjc1IDY5Mi4zOTIgMjA1LjkyNiIgZmlsbD0iIzNmM2Q1NiIvPjxjaXJjbGUgY3g9IjU0OS45Njg5OSIgY3k9IjE4OC44NDY0NiIgcj0iMjIuNTkxNjQiIGZpbGw9IiNmZTYzNGUiLz48cG9seWdvbiBwb2ludHM9IjU1Mi4xNDYgMjU2Ljg5NCA1NDcuNTE5IDI1Ni44OTQgNTQ5LjYyOSAxODUuNDQ0IDU1Mi4xNDYgMjU2Ljg5NCIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iNTUwLjAzNyAxOTguOTg1IDU1NS4wMDQgMTkyLjExMyA1NDkuOTY5IDIwMC42ODcgNTQ5LjQyNSAxOTkuNzM0IDU1MC4wMzcgMTk4Ljk4NSIgZmlsbD0iIzNmM2Q1NiIvPjxwb2x5Z29uIHBvaW50cz0iNTQ5LjQ5MyAyMDUuOTI2IDU0NC41MjUgMTk5LjA1NCA1NDkuNTYxIDIwNy42MjcgNTUwLjEwNSAyMDYuNjc1IDU0OS40OTMgMjA1LjkyNiIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik05NzQuMDc0LDY5NS44MTU1N0gyMzYuODA4MTlhNzAuNzM0LDcwLjczNCwwLDEsMSwwLTE0MS40NjhIOTcyLjQ0MTY0YTI3LjIwNTM4LDI3LjIwNTM4LDAsMCwwLDAtNTQuNDEwNzZIMjEyLjMyMzM1di00My41Mjg2SDk3Mi40NDE2NGE3MC43MzQsNzAuNzM0LDAsMSwxLDAsMTQxLjQ2OEgyMzYuODA4MTlhMjcuMjA1MzgsMjcuMjA1MzgsMCwxLDAsMCw1NC40MTA3Nkg5NzQuMDc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0iI2U2ZTZlNiIvPjxyZWN0IHg9IjgyLjcwNDM1IiB5PSIyNzIuODk5OSIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIxNzguNDY3MjkiIHk9IjI3Mi44OTk5IiB3aWR0aD0iMzMuNzM0NjciIGhlaWdodD0iMi4xNzY0MyIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjI3NC4yMzAyMiIgeT0iMjcyLjg5OTkiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMzY5Ljk5MzE2IiB5PSIyNzIuODk5OSIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI0NjUuNzU2MDkiIHk9IjI3Mi44OTk5IiB3aWR0aD0iMzMuNzM0NjciIGhlaWdodD0iMi4xNzY0MyIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjU2MS41MTkwMyIgeT0iMjcyLjg5OTkiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNjU3LjI4MTk2IiB5PSIyNzIuODk5OSIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI3NTMuMDQ0ODkiIHk9IjI3Mi44OTk5IiB3aWR0aD0iMzMuNzM0NjciIGhlaWdodD0iMi4xNzY0MyIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjgyLjcwNDM1IiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTc4LjQ2NzI5IiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMjc0LjIzMDIyIiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMzY5Ljk5MzE2IiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNDY1Ljc1NjA5IiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNTYxLjUxOTAzIiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNjU3LjI4MTk2IiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNzUzLjA0NDg5IiB5PSIzNzAuODM5MjYiIHdpZHRoPSIzMy43MzQ2NyIgaGVpZ2h0PSIyLjE3NjQzIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iODIuNzA0MzUiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIxNzguNDY3MjkiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIyNzQuMjMwMjIiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIzNjkuOTkzMTYiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI0NjUuNzU2MDkiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI1NjEuNTE5MDMiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI2NTcuMjgxOTYiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI3NTMuMDQ0ODkiIHk9IjQ2OC43Nzg2MyIgd2lkdGg9IjMzLjczNDY3IiBoZWlnaHQ9IjIuMTc2NDMiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNzMyLjAxMDE2LDI5OC44Nzk0N2EyOC45OTE5MSwyOC45OTE5MSwwLDAsMC02LjA0NTA3LTUuNzAzNTFoMTIuNjIzNzlBMjEuMTE0MTIsMjEuMTE0MTIsMCwwLDAsNzMyLjAxMDE2LDI5OC44Nzk0N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTYuODI0MzcgLTIwNC4xODQ0MykiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNNjkwLjc0MzI1LDI5My4xNzZoMi4xNzYxNmMtLjQ2NzUyLjMyODQ1LS45MzY0OC42NTUzOS0xLjM4MzA3LDEuMDEwMzZDNjkxLjI4MTQ1LDI5My44NDE4MSw2OTEuMDA5MzIsMjkzLjUxMTM2LDY5MC43NDMyNSwyOTMuMTc2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik03NDguNjkyMDgsMjkwLjU1ODU2YTIwLjgzMjkyLDIwLjgzMjkyLDAsMCwxLDEwLjEyOTI0LDIuNjE3NEg3MzguNTg4ODhBMjAuNzQxODgsMjAuNzQxODgsMCwwLDEsNzQ4LjY5MjA4LDI5MC41NTg1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTYuODI0MzcgLTIwNC4xODQ0MykiIGZpbGw9IiNlNmU2ZTYiLz48cGF0aCBkPSJNNzA5LjQzMTExLDI4Ny45NDExN2EyOC42MjMsMjguNjIzLDAsMCwxLDE2LjUzNCw1LjIzNDc5SDY5Mi45MTk0MUEyOC42MTYzNywyOC42MTYzNywwLDAsMSw3MDkuNDMxMTEsMjg3Ljk0MTE3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik00ODcuMDM2MDYsMjU0LjgwNzQ0YTUzLjY1NjE1LDUzLjY1NjE1LDAsMCwxLDEwNS4yNzQzMS0xMS4zMTI2Yy42NS0uMDIzMzIsMS4yOTk1MS0uMDQ5NDQsMS45NTUyMi0uMDQ5NDRhNTMuNjY5MDksNTMuNjY5MDksMCwwLDEsNTEuNDgyMTgsMzguNTM4MzNBMzcuOTIwMzYsMzcuOTIwMzYsMCwwLDEsNjkwLjc0MzI1LDI5My4xNzZoLTE2Ny4zNzJhMzYuMjkzMjMsMzYuMjkzMjMsMCwwLDEtMzYuMzczMTMtMzcuNTc3MThRNDg3LjAxNDIyLDI1NS4yMDM3LDQ4Ny4wMzYwNiwyNTQuODA3NDRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU2LjgyNDM3IC0yMDQuMTg0NDMpIiBmaWxsPSIjZTZlNmU2Ii8+PHBhdGggZD0iTTc3Ny41ODcwNSwzMzguMDU1MjJhMjguOTkyMTQsMjguOTkyMTQsMCwwLDEsNi4wNDUwNy01LjcwMzUxSDc3MS4wMDgzM0EyMS4xMTM4OCwyMS4xMTM4OCwwLDAsMSw3NzcuNTg3MDUsMzM4LjA1NTIyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik04MTguODU0LDMzMi4zNTE3MWgtMi4xNzYxNmMuNDY3NTIuMzI4NDUuOTM2NDcuNjU1MzksMS4zODMwNiwxLjAxMDM2QzgxOC4zMTU3NiwzMzMuMDE3NTYsODE4LjU4NzksMzMyLjY4NzExLDgxOC44NTQsMzMyLjM1MTcxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik03NjAuOTA1MTQsMzI5LjczNDMxYTIwLjgzMjg2LDIwLjgzMjg2LDAsMCwwLTEwLjEyOTI0LDIuNjE3NGgyMC4yMzI0M0EyMC43NDE3MSwyMC43NDE3MSwwLDAsMCw3NjAuOTA1MTQsMzI5LjczNDMxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik04MDAuMTY2MTEsMzI3LjExNjkxYTI4LjYyMjkzLDI4LjYyMjkzLDAsMCwwLTE2LjUzNCw1LjIzNDhoMzMuMDQ1NjlBMjguNjE2MzUsMjguNjE2MzUsMCwwLDAsODAwLjE2NjExLDMyNy4xMTY5MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTYuODI0MzcgLTIwNC4xODQ0MykiIGZpbGw9IiNlNmU2ZTYiLz48cGF0aCBkPSJNMTAyMi41NjExNSwyOTMuOTgzMThhNTMuNjU2MTUsNTMuNjU2MTUsMCwwLDAtMTA1LjI3NDMxLTExLjMxMjU5Yy0uNjUtLjAyMzMzLTEuMjk5NTEtLjA0OTQ1LTEuOTU1MjItLjA0OTQ1YTUzLjY2OTA5LDUzLjY2OTA5LDAsMCwwLTUxLjQ4MjE4LDM4LjUzODMzQTM3LjkyMDM4LDM3LjkyMDM4LDAsMCwwLDgxOC44NTQsMzMyLjM1MTcxSDk4Ni4yMjZhMzYuMjkzMjQsMzYuMjkzMjQsMCwwLDAsMzYuMzczMTQtMzcuNTc3MTlRMTAyMi41ODMsMjk0LjM3OTQ1LDEwMjIuNTYxMTUsMjkzLjk4MzE4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1Ni44MjQzNyAtMjA0LjE4NDQzKSIgZmlsbD0iI2U2ZTZlNiIvPjxyZWN0IHg9IjkxMC45NzY3NSIgeT0iNjYyLjMxNDQiIHdpZHRoPSIxOS40NTI2NCIgaGVpZ2h0PSIzLjA4NzcyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjg0LjIyNjc4IDExMjQuMDI0MTMpIHJvdGF0ZSgtMTc5Ljk2OTM3KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik03NzAuMzMxNTQsNjYzLjAwNmw0LjAxMzU0LjkyODQ2LDE1Mi41MzMzNS4wODE1NCwxLjM3MTYxLTMuMTk1NzJhMzIuMjU3LDMyLjI1NywwLDAsMCwyLjM3MTQ4LTE3LjQ0MTkzYy0uNjU2OTQtNC40MTM2LTIuMzAzMTUtOC43OTkxNC02LjA0MjEzLTEwLjcwMzk0TDkxNy44MTA1LDU4Ny41OWwtODQuMzg4ODYtLjE1MUw4MDAuNzcxOSw2MTMuNzczMDhzLTE1LjQwMTM3LS4yNzY4Ni0yMy43Njg1LDEwLjEzOTcyYTI0LjQ0OTU5LDI0LjQ0OTU5LDAsMCwwLTUuMTE0MywxMy40NjU5MWwtLjMzMDIyLDUuNDE4NzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU2LjgyNDM3IC0yMDQuMTg0NDMpIiBmaWxsPSIjZmU2MzRlIi8+PGNpcmNsZSBjeD0iNjQ3LjAwOTMzIiBjeT0iNDU4LjA2NzUiIHI9IjE4LjgzNTA5IiBmaWxsPSIjM2YzZDU2Ii8+PGNpcmNsZSBjeD0iNjQ3LjAwOTMzIiBjeT0iNDU4LjA2NzUiIHI9IjkuOTEzMjEiIGZpbGw9IiNjY2MiLz48Y2lyY2xlIGN4PSI3MzkuOTQ5NjkiIGN5PSI0NTguMTE3MTgiIHI9IjE4LjgzNTA5IiBmaWxsPSIjM2YzZDU2Ii8+PGNpcmNsZSBjeD0iNzM5Ljk0OTY5IiBjeT0iNDU4LjExNzE4IiByPSI5LjkxMzIxIiBmaWxsPSIjY2NjIi8+PHBvbHlnb24gcG9pbnRzPSI2NTYuOTIgNDA2LjUxMSA3MDIuNDgzIDQwNi41MyA3MDguMDQ1IDQwNi41MyA3MTcuNDM1IDQwNi41MzcgNzE3LjQzNSA0MDUuODUyIDcxNy40NDIgMzk3LjU5NCA3MTcuNDQ5IDM4OC4zMjIgNzExLjIwMSAzODguMzIyIDcwNS42MzkgMzg4LjMxNiA2OTUuNzg3IDM4OC4zMDkgNjkwLjIyNSAzODguMzA5IDY3OC44NTEgMzg4LjMwMiA2NTYuOTIgNDA2LjUxMSIgZmlsbD0iI2ZmZiIvPjxwb2x5Z29uIHBvaW50cz0iNzI0Ljg0OSA0MDYuNTQ0IDc0OC45MjkgNDA2LjU1NyA3NDguOTM1IDQwMS44MzIgNzQ4LjkzNSAzOTMuNTc0IDc0OC45NDIgMzg4LjM0MiA3NDUuNDE2IDM4OC4zNDIgNzM5Ljg1NCAzODguMzM1IDcyNC44NTYgMzg4LjMyOSA3MjQuODQ5IDQwNi41NDQiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI4NzEuMTY0NzMiIHk9IjYyNC4zMDk3OCIgd2lkdGg9IjMuMDg3NzIiIGhlaWdodD0iNS44NjY2NyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU4OC4yNTc0IDEwNTAuNzY4Mikgcm90YXRlKC0xNzkuOTY5MzcpIiBmaWxsPSIjM2YzZDU2Ii8+PHJlY3QgeD0iODIxLjYxMjAzIiB5PSI2MTQuNTU2OTgiIHdpZHRoPSIzLjA4NzcyIiBoZWlnaHQ9IjUuODY2NjciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyODQuMjYxNzMgLTQwOS41MTk4Mikgcm90YXRlKDkwLjAzMDYzKSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik04MTcuMTM4MzgsNjA0LjM5N2guMzM5NjZhNi40NTMzMyw2LjQ1MzMzLDAsMCwxLDYuNDUzMzMsNi40NTMzM3YwYTYuNDUzMzMsNi40NTMzMywwLDAsMS02LjQ1MzMzLDYuNDUzMzNoLS4zMzk2NmEwLDAsMCwwLDEsMCwwVjYwNC4zOTdBMCwwLDAsMCwxLDgxNy4xMzgzOCw2MDQuMzk3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ4My45MTg3NCAxMDE3Ljk1NDcpIHJvdGF0ZSgtMTc5Ljk2OTM3KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik03NzEuNTU4ODgsNjQyLjc5NzQ5YTkuOTc0NzMsOS45NzQ3MywwLDAsMCw1LjQ0NDUyLTE4Ljg4NDY5LDI0LjQ0OTU5LDI0LjQ0OTU5LDAsMCwwLTUuMTE0MywxMy40NjU5MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTYuODI0MzcgLTIwNC4xODQ0MykiIGZpbGw9IiMzZjNkNTYiLz48cG9seWdvbiBwb2ludHM9IjcwNS42MzkgMzg4LjMxNiA3MTcuNDM1IDQwNS44NTIgNzE3LjQ0MiAzOTcuNTk0IDcxMS4yMDEgMzg4LjMyMiA3MDUuNjM5IDM4OC4zMTYiIGZpbGw9IiNmMmYyZjIiLz48cG9seWdvbiBwb2ludHM9IjczOS44NTQgMzg4LjMzNSA3NDguOTM1IDQwMS44MzIgNzQ4LjkzNSAzOTMuNTc0IDc0NS40MTYgMzg4LjM0MiA3MzkuODU0IDM4OC4zMzUiIGZpbGw9IiNmMmYyZjIiLz48cG9seWdvbiBwb2ludHM9IjY5MC4yMjUgMzg4LjMwOSA3MDIuNDgzIDQwNi41MyA3MDguMDQ1IDQwNi41MyA2OTUuNzg3IDM4OC4zMDkgNjkwLjIyNSAzODguMzA5IiBmaWxsPSIjZjJmMmYyIi8+PGNpcmNsZSBjeD0iNTAuMDU3OSIgY3k9IjI2MC45Mjk1MyIgcj0iNTAuMDU3OSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik0yMDcuMDkwNTYsNDgwLjE4NDI1bC0yNS4wNTA3My0yNS4wNTA3M2E0LjM1MzE1LDQuMzUzMTUsMCwwLDEsNi4xNTYyOC02LjE1NjI4TDIwNi42NzQsNDY3LjQ1NTExbDU4Ljk2Mzk0LTY3LjIzOTI3YTQuMzUyNzEsNC4zNTI3MSwwLDAsMSw2LjU0NTIzLDUuNzM5N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTYuODI0MzcgLTIwNC4xODQ0MykiIGZpbGw9IiNmZTYzNGUiLz48L3N2Zz4=" />}/>
      }
    </Fragment>
  );
}

export default RidesList;
