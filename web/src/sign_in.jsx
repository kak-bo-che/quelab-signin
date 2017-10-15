import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import 'bootstrap'
import Contacts from './mqtt_client.jsx'
import showdown from 'showdown'
showdown.setFlavor('github')
const mdConv = new showdown.Converter({ ghCompatibleHeaderId: true, strikethrough: true, ghCodeBlocks: true, tasklists: true })

class SignInForm extends Component {
    constructor() {
        super()
        this.state = { firstName: null, lastName: null, isMember:false, formError:false, loginMessage:null}
        this.url_prefix = "/api"
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

    handleChange(event){
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    handleSubmit(event){
      event.preventDefault();
      let data = new FormData()
      const formFields = ['firstName', 'lastName', 'isMember'];
      formFields.map( name => {
        data.append(name, this.state[name]);
      })
      fetch(new Request('/api/signin', { method: 'POST', body: data }))
      .then((resp) => {
          if (resp.status !== 200) {
          this.setState({ formError: true })
          } else {
          this.setState({ formError: false })
          }
          return resp
      })
      .catch(() => {
          this.setState({ uploadErr: "Unable to reach user log collector" })
      })
      .then((d) => {
          if (this.state.formError) {
            if(d) {
              this.state.formError = d || "unexpected error ocurred"
            }
          } else {
            this.setState({ loginMessage: d})
          }
      })

    }

    render(){
        return(
        <form  id="signin" onChange={this.handleChange} onSubmit={this.handleSubmit}>
            <div className="form-group container">
              <div className="row">
                <label className="col">First Name
                  <input type="text" id="first_name" className="form-control" name="firstName" content={this.state.firstName}/>
                </label>
                <label className="col">Last Name
                  <input type="text" id="last_name" className="form-control" name="lastName" content={this.state.lastName}/>
                </label>
              </div>
                <label className="form-check-label">
                    <input type="checkbox" id="is_member" className="form-check-input" name="isMember"/>Member
                </label>
            </div>

            <div className="form-group">

                <p>I hereby acknowledge that I have <b>carefully</b> read the provisions of
                the <i>Release of Liability</i>, fully understand the terms and conditions
                expressed there, and do freely choose acceptance of the provisions of the
                sections relating to assumption of risk, release of liability, covenant
                not to sue, and third party indemnification.
                </p>
            </div>
            <div className="form-group">
                <input type="submit" value="Sign in" role="button"
                    className="btn btn-primary" />
            </div>
        </form>
        )
    }
}

class SignIn extends Component {
  render() {

    return (
        <div>
            <h1 className="display-4 p-1">Welcome to Quelab</h1>

            <div className="row">
                <div className="col-12">
                    <div className="alert alert-info d-none" role="alert" id="signin_notification" />
                    <p>Visitors and members who don't have (or forgot to bring, or have not yet
                        activated) RFID keys, please manually sign in.
                    </p>
            </div>
            <div className="col-10 mx-5" >
                <SignInForm />
                <Contacts />
            </div>
          </div>
        </div>
    )

  }

}


class Info extends Component {

  componentDidMount() {
    const codes = this.domEl.querySelectorAll('pre')
    for (let c of codes) {
      hljs.highlightBlock(c)
    }
  }


  render() {

    let docs
    if (this.props.docs) {
      docs = <div ref={(div) => { this.domEl = div }} className="markdown-body" dangerouslySetInnerHTML={{ __html: this.props.docs }} />
    } else {
      docs = <div ref={(div) => { this.domEl = div }} className='jumbotron'>
        <div className='container'>
          <h1 className='display3'>{this.props.name}</h1>
          <p>The docs could not be retrieved.</p>
        </div>
      </div>
    }

    return (
      docs
    )
  }
}


class App extends Component {


  constructor() {
    super()
    this.state = { docs: undefined, version: undefined }
  }


  componentWillMount() {

    fetch("/static/README.md")
      .then((resp) => {
        if (resp.status == 200) {
          return resp.text().then((docs) => {
            this.setState({ docs: mdConv.makeHtml(docs) })
          })
        }
      })
  }

  render() {
    return (
      <div>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
          <a className='navbar-brand'>Quelab</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse"
                  data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                  aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className='navbar-collapse collapse' id="navbarSupportedContent">
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item active'>
                <Link to="/" className='nav-link'>Sign In<span className='sr-only'>(current)</span></Link>
              </li>
              <li className='nav-item'>
                <Link to="/info" className='nav-link'>Info</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Route path="/" component={SignIn} />
        <Route path="/info" exact={true} component={function () {
          return <Info docs={this.state.docs} {...this.props} />
        }.bind(this)} />
        <div className='container'>

          <hr />

          <footer>
          </footer>
        </div>

      </div>

    )
  }
}

export default App;