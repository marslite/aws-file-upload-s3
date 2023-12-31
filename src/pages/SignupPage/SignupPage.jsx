import { useState } from 'react'
import userService from '../../utils/userService'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import {
	Button,
	Form,
	Grid,
	Header,
	Image,
	Message,
	Segment,
  } from "semantic-ui-react";

// this hook can be used to programtically change url we are on 
// on the client (react, browser code)
import { useNavigate } from 'react-router-dom';

export default function SignUpPage({handleSignUpOrLogin}){

		const [state, setState] = useState({
			username: '',
			email: '',
			password: '',
			passwordConf: '',
			bio: ''
		})

		const [error, setError] = useState('');
		const [selectedFile, setSelectedFile] = useState('');

		function handleFileInput(e){
			console.log(e.target.files);
			setSelectedFile(e.target.files[0]);
		}
		
		// navigate is a function that just takes a path
		// the path should match a route defined in the App.js
		const navigate = useNavigate()

		function handleChange(e){

			setState({
				...state,
				[e.target.name]: e.target.value
			})
		}	




		async function handleSubmit(e){
			e.preventDefault();

			const formData = new FormData();
			formData.append('username', state.username);
			formData.append('email', state.email);
			formData.append('password', state.password);
			formData.append('bio', state.bio);
			formData.append('photo', selectedFile);

			try {
				// this line of code is making the fetch request to the server
				// and sending our state object
				// this is calling the signup fetch function defined in our utils/userService
				
				
				const signUp = await userService.signup(formData)
				console.log(formData.forEach((item) => console.log(item, "From formData")));
				console.log(signUp)
				// navigate the user to the home page!
				navigate('/');
				handleSignUpOrLogin(); // this function comes from the APP component



			} catch(err){
				console.log(err, ' err in handleSubmit');
				setError('Check your terminal for your error and the chrome console!')
			}

		}
	
		return (
			<Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
			 <Grid.Column style={{ maxWidth: 450 }}>
				<Header as="h2" color="purple" textAlign="center">
				 <Image src="https://i.imgur.com/TM4eA5g.jpg" /> Sign Up
			   </Header>
			   <Form autoComplete="off" onSubmit={handleSubmit}>
				 <Segment stacked>
				   <Form.Input
					 name="username"
					 placeholder="username"
					 value={state.username}
					 onChange={handleChange}
					 required
				   />
				   <Form.Input
					 type="email"
					 name="email"
					 placeholder="email"
					 value={state.email}
					 onChange={handleChange}
					 required
				   />
				   <Form.Input
					 name="password"
					 type="password"
					 placeholder="password"
					 value={state.password}
					 onChange={handleChange}
					 required
				   />
				   <Form.Input
					 name="passwordConf"
					 type="password"
					 placeholder="Confirm Password"
					 value={state.passwordConf}
					 onChange={handleChange}
					 required
				   />
				   <Form.TextArea
					 label="bio"
					 name="bio"
					 placeholder="Tell us more about your dogs..."
					 value={state.bio}
					 onChange={handleChange}
				   />
				   <Form.Field>
					 <Form.Input
					   type="file"
					   name="photo"
					   onChange={handleFileInput}
					   placeholder="upload image"
					 />
				   </Form.Field>
				   <Button type="submit" className="btn">
					 Signup
				   </Button>
				 </Segment>
				 {error ? <ErrorMessage error={error} /> : null}
			   </Form>
			 </Grid.Column>
		   </Grid>
	   
			 );
	   
		}
