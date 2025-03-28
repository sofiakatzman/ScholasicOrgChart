import { useState, useContext } from "react"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"

import { UserContext } from '../../functionality/UserContext.js'

const AuthCard = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const {setUser} = useContext(UserContext)

  const handleSubmit = (values) => {
    const url = "/api/login"
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Invalid credentials")
        }
      })
      .then((data) => {
        setUser(data)
        navigate(`/`)
      })
      .catch((error) => {
        console.error(error)
        setErrorMessage("Invalid credentials. Please check your username and password.")
        console.log(error.response)
      })
  }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a username."),
    password: yup.string().required("Please enter a password."),
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <form className="auth-form" onSubmit={formik.handleSubmit}>
        <h4>Enter credentials to log in:</h4>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <input type="submit" value="Log In" />
      </form>
      {errorMessage && (
        <div className="errors">
          <h6 style={{ color: "red" }}>{errorMessage}</h6>
        </div>
      )}
      {formik.errors && (
        <div className="errors">
          <ul>
            {Object.values(formik.errors).map((error, index) => (
              <h6 key={index} style={{ color: "red" }}>
                {error}
              </h6>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}


export default AuthCard;