import { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { toast } from "react-toastify";
import { Redirect, Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import IconImage from "../Images/userIcon.png";
import Footer from "../Footer/Footer.js";
import PropTypes from "prop-types";

function UpdateProfile(props) {
  let loggedIn = useRef(null);
  const [isLoggedIn, setLoggedIn] = useState(loggedIn);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsDataLoading(true);
      const result = await fetch("/auth/isLoggedIn", { method: "GET" });
      const parsedResult = await result.json();
      loggedIn.current = parsedResult.isLoggedIn;
      setLoggedInUser(parsedResult.user);
      setLoggedIn(loggedIn.current);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (loggedInUser && loggedInUser._id) {
        const userDataResult = await fetch(`/userData/${loggedInUser._id}`, {
          method: "GET",
        });
        const parsedUserDataResult = await userDataResult.json();
        setNameValue(parsedUserDataResult.fullname);
        setInstValue(parsedUserDataResult.institution);
        setJobValue(parsedUserDataResult.job);
        setLocationValue(parsedUserDataResult.location);
        setEmailValue(parsedUserDataResult.username);
        setIsDataLoading(false);
      }
    }
    fetchUserData();
  }, [loggedInUser]);

  /* useStates established to prepopulate form */
  let [nameValue, setNameValue] = useState("");
  let [institutionValue, setInstValue] = useState("");
  let [jobValue, setJobValue] = useState("");
  let [locationValue, setLocationValue] = useState("");
  let [emailValue, setEmailValue] = useState("");
  let [updateStatus, setUpdateStatus] = useState(false);

  let handleNameChange = (event) => {
    setNameValue(event.target.value);
  };
  let handleInstChange = (event) => {
    setInstValue(event.target.value);
  };
  let handleJobChange = (event) => {
    setJobValue(event.target.value);
  };
  let handleLocationChange = (event) => {
    setLocationValue(event.target.value);
  };
  let handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };
  let handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      userFullName: nameValue,
      userInstitution: institutionValue,
      userJob: jobValue,
      userLocation: locationValue,
      userEmail: emailValue,
      id: loggedInUser._id,
    };

    const res = await fetch("/userData/updateProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    const parsedRes = await res.json();
    if (parsedRes.result) {
      setUpdateStatus(true);
      toast.success("Successfully updated profile!");
    } else {
      toast.error("Couldn't update the profile. Please try again.");
    }
  };

  // this handles the logoutbutton pressing and we call the props.logoutpressed too to let the main App component know the state has changed.
  const logoutPressed = () => {
    setLoggedIn(false);
    setLoggedInUser(null);
    props.logoutPressed();
  };

  if (isLoggedIn && !updateStatus) {
    return (
      <div className="profile-cont">
        <Navbar logoutPressed={logoutPressed} />
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/dashboard">
                  <span data-feather="home"></span>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/profile">
                  <span data-feather="file"></span>
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <form onSubmit={handleSubmit} className="profile-container">
            <div className="main-body">
              {isDataLoading && (
                <Loader
                  type="Puff"
                  color="#3feee6"
                  height={500}
                  width={500}
                  timeout={3000} //3 secs
                />
              )}
              {!isDataLoading && (
                <div className="row gutters-sm">
                  <div className="col-md-4 mb-3">
                    <div className="profile-card">
                      <div className="p-card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                          <img
                            src={IconImage}
                            alt="Admin"
                            className="rounded-circle"
                            width="120"
                          />
                          <h4 class="card-title mb-0">{nameValue}</h4>
                          <div className="mt-3">
                            <button type="submit" className="btn editBtn">
                              Save Profile
                            </button>
                          </div>
                          <div className="mt-1">
                            <Link
                              className="btn btnCancel"
                              id="buttonColor"
                              to="/profile"
                            >
                              Cancel Update
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="profile-card mb-3">
                      <div className="p-card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Full Name</h6>
                          </div>
                          <input
                            className="col-sm-9 text-secondary"
                            value={nameValue}
                            type="text"
                            name="fullname"
                            onChange={handleNameChange}
                            required
                          />
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Job</h6>
                          </div>
                          <input
                            className="col-sm-9 text-secondary"
                            value={jobValue}
                            type="text"
                            name="job"
                            onChange={handleJobChange}
                            required
                          />
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Institution</h6>
                          </div>
                          <input
                            className="col-sm-9 text-secondary"
                            value={institutionValue}
                            type="text"
                            name="institution"
                            onChange={handleInstChange}
                            required
                          />
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Email</h6>
                          </div>
                          <input
                            className="col-sm-9 text-secondary"
                            value={emailValue}
                            type="email"
                            name="email"
                            onChange={handleEmailChange}
                          />
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Location</h6>
                          </div>
                          <input
                            className="col-sm-9 text-secondary"
                            value={locationValue}
                            type="text"
                            name="location"
                            onChange={handleLocationChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#97caef"
                  fillOpacity="1"
                  d="M0,0L48,5.3C96,11,192,21,288,69.3C384,117,480,203,576,208C672,213,768,139,864,133.3C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </form>
          <Footer />
        </main>
      </div>
    );
  } else {
    return <Redirect to="/profile" />;
  }
}

UpdateProfile.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default UpdateProfile;
