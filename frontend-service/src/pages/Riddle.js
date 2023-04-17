import { useState } from "react"
import { toast } from 'react-toastify'
import { useUserContext } from "../context/user.js"

import SubmitButton from "../components/form/SubmitButton"
import Field from "../components/form/Field"
import H1 from "../components/layout/H1"
import authenClient from "../clients/authenClient"

export default function Riddle() {
  let [response, setResponse] = useState('')
  let [guess, setGuess] = useState({ answer: '' })
  let { checkTokenValid } = useUserContext();

  const onSubmit = async (e) => {
    e.preventDefault();
    await authenClient
      .sendAnswer(guess)
      .then((data) => {
        setResponse(data.data);
      })
      .catch((error) => {
        setResponse('');
        checkTokenValid();
        toast.error(error.response.data.detail || "Something went wrong");
      });
  };

  return <>
    <H1 html="The Doors of Durin, Lord of Moria. Speak, friend, and enter."/>
    <img className="mx-auto" src="https://tolkiengateway.net/w/images/e/ea/J.R.R._Tolkien_-_Doors_of_Durin.jpg" alt="Door of Durin" />
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
       <div className="w-full max-w-md">
        <form onSubmit={ onSubmit }>
          <Field
            name="answer"
            type="text"
            label="Answer"
            value={ guess.answer }
            onChange={(e) => setGuess({ answer: e.target.value })} />
          <SubmitButton html="Submit" />
        </form>
        <p className="whitespace-pre-line text-left py-8">{ response }</p>
      </div>
    </div>
  </>
}
