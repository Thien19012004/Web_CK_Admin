import React from "react";
import { Label, TextInput, Button, Checkbox } from "flowbite-react";

const RegisterForm = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {/* Header Background */}
      <div
        className="w-full h-10 bg-center"
      ></div>

      {/* Register Form */}
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 -mt-32 z-10"
        style={{
          background: "hsla(0, 0%, 100%, 0.8)",
          backdropFilter: "blur(30px)",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Sign up now</h2>

        {/* Form */}
        <form>
        <div className="mb-4">
            <Label htmlFor="fullName" value="Full Name" />
            <TextInput
              id="fullName"
              placeholder="Full Name"
              required
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" value="Email address" />
            <TextInput
              id="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="Password"
              required
              className="w-full"
            />
          </div>

          {/* Subscribe Checkbox
          <div className="flex items-center mb-4">
            <Checkbox id="subscribe" />
            <Label htmlFor="subscribe" className="ml-2">
              Subscribe to our newsletter
            </Label>
          </div> */}

          {/* Submit Button */}
          <Button gradientDuoTone="blueToIndigo" className="w-full mb-4">
            Sign Up
          </Button>
        </form>

        {/* Social Buttons */}
        <div className="text-center mt-4">
          <p className="text-sm mb-2">or sign up with:</p>
          <div className="flex justify-center gap-4">
            <Button color="blue" size="sm">
              <i className="fab fa-facebook-f"></i>
            </Button>
            <Button color="blue" size="sm">
              <i className="fab fa-twitter"></i>
            </Button>
            <Button color="red" size="sm">
              <i className="fab fa-google"></i>
            </Button>
            <Button color="gray" size="sm">
              <i className="fab fa-github"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
