import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import mqtt from 'mqtt'
import rfid_img from './icons/rfid.svg'
import form_img from './icons/form.svg'
import mqtt_online from './icons/server_online.svg'
import mqtt_offline from './icons/server_offline.svg'
import moment from 'moment'
// import { Client, Message } from 'react-native-paho-mqtt';

class MqttLoginListener extends Component {
    constructor(){
        super()
    }
}
class Contacts extends Component {
  constructor(props){
    super(props);
    this.state = {recentLogins: [], conection_established: false}
    this.handleClick = this.handleClick.bind(this);
    this.handleContactReceived = this.handleContactReceived.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.handleDisconnected = this.handleDisconnected.bind(this);

  }
  componentDidMount() {
    this.client  = mqtt.connect('ws://localhost:1884')
    this.client.on('connect', () => {
      this.client.subscribe('quelab/door/entry');
      this.handleConnected();
    })

    this.client.on('offline', () => {
      this.handleDisconnected();
    })

    this.client.on('message', (topic, message) => {
      // message is Buffer
      // console.log(message.toString());
      if (topic == 'quelab/door/entry'){
        let json_message = JSON.parse(message.toString());
        this.handleContactReceived(json_message);
      }
    })
  }

  componentWillUnmount() {
    this.client.end();
  }

  handleConnected(){
    this.setState(prevState => ({
      connection_established: true
    }))
    console.log("connected");
  }

  handleDisconnected(){
    this.setState(prevState => ({
      connection_established: false
    }))
    console.log("disconnected");
  }

  handleClick(){
    this.setState(prevState => ({
      recentLogins: prevState.recentLogins.concat(const_contact)
    }));
  }

  handleContactReceived(contact){
    let contacts = this.state.recentLogins.filter(old_contact => {
      return old_contact['Id'] != contact['Id'];
    })
      this.setState(prevState => (
        {
        recentLogins: [contact].concat(contacts.slice(0, 9))
      }));

  }
  render(){
    return (
      <div>
      <div className="row mx-2">
        <div className="col d-flex justify-content-between">
          <h3 className="mb-0">Recent Member Sign-ins</h3>
          <ConnectionState connection_status={this.state.connection_established} />
        </div>
      </div>

      <div className="row mx-2">
        {this.state.recentLogins.map((contact, index ) => {
          {/* contact.Id is the correct key to use here */}
          return <Contact key={contact.Id} contact={contact} />
          }
        )}
      </div>
      </div>
    )
  }
}

class ConnectionState extends Component {
  render(){
    let connected = null;
    if (this.props.connection_status == true){
      connected = <img src={mqtt_online} title="Connected to MQTT Server" />
    } else {
      connected = <img src={mqtt_offline} title="Not connected to MQTT Server" />
    }
    return( <div style={{"width": "30px", "height":"30px"}}>{connected}</div> )
  }
}

class Avatar extends Component {
  render(){
    const avatar = this.props.avatar;
    const id = this.props.id;
    var avatar_url = null;
    if (avatar === null){
      avatar_url = 'https://robohash.org/' + id + '.png?size=110x110&set=set3&bgset=any'
    } else {
      const file_name = Object.keys(avatar)[0];
      {/* check filename to mime here */}
      avatar_url = "data:image/png;base64, " + avatar[file_name]
    }
    return(
      <img className={this.props.className} src={avatar_url} />
    )
  }
}

class ContactDetails extends Component {
  render(){
    let contact = this.props.contact;
    let image = null;
    if (contact['source'] == 'rfid'){
      image = rfid_img;
    } else {
      image = form_img;
    }
    return(
      <div>
        <div>
          {moment(contact['signin_time']).fromNow()}
        </div>
        <div>
          <img src={image} style={{"width": "40px"}}/>
        </div>
      </div>
    )
  }
}

class Contact extends Component {
  render(){
      const contact = this.props.contact;
        return(
            <div className="card col-2 p-1 m-1 border-dark border-rounded">
                <div className="card-img-top bg-dark w-100 d-flex align-items-center" >
                 < Avatar className="w-100" id={contact.Id} avatar={contact.avatar} />
                </div>
                <div className="card-body bg-light text-center p-0 d-flex align-items-end justify-content-center">
                  <ContactDetails contact={contact} />
                </div>
                <div className="card-footer text-light bg-dark text-center p-0">
                  <h5 className="m-1">{contact.FirstName} {contact.LastName}</h5>
                </div>

            </div>
        )
    }
}
const const_contact = {
    "FirstName": "Troy",
    "LastName": "Ross",
    "Email": "kak.bo.che@gmail.com",
    "DisplayName": "Ross, Troy",
    "Organization": "",
    "ProfileLastUpdated": "2017-10-06T23:58:56-06:00",
    "MembershipLevel": {
      "Id": 902677,
      "Url": "https://api.wildapricot.org/v2.1/accounts/240904/MembershipLevels/902677",
      "Name": "Sustaining"
    },
    "MembershipEnabled": true,
    "Status": "Active",
    "FieldValues": [
      {
        "FieldName": "Archived",
        "Value": false,
        "SystemCode": "IsArchived"
      },
      {
        "FieldName": "Donor",
        "Value": false,
        "SystemCode": "IsDonor"
      },
      {
        "FieldName": "Event registrant",
        "Value": false,
        "SystemCode": "IsEventAttendee"
      },
      {
        "FieldName": "Member",
        "Value": true,
        "SystemCode": "IsMember"
      },
      {
        "FieldName": "Suspended member",
        "Value": false,
        "SystemCode": "IsSuspendedMember"
      },
      {
        "FieldName": "Event announcements",
        "Value": true,
        "SystemCode": "ReceiveEventReminders"
      },
      {
        "FieldName": "Member emails and newsletters",
        "Value": true,
        "SystemCode": "ReceiveNewsletters"
      },
      {
        "FieldName": "Email delivery disabled",
        "Value": false,
        "SystemCode": "EmailDisabled"
      },
      {
        "FieldName": "Receiving emails disabled",
        "Value": false,
        "SystemCode": "RecievingEMailsDisabled"
      },
      {
        "FieldName": "Balance",
        "Value": 0,
        "SystemCode": "Balance"
      },
      {
        "FieldName": "Total donated",
        "Value": 0,
        "SystemCode": "TotalDonated"
      },
      {
        "FieldName": "Registered for specific event",
        "Value": null,
        "SystemCode": "RegistredForEvent"
      },
      {
        "FieldName": "Profile last updated",
        "Value": "2017-10-06T23:58:56-06:00",
        "SystemCode": "LastUpdated"
      },
      {
        "FieldName": "Profile last updated by",
        "Value": 41743765,
        "SystemCode": "LastUpdatedBy"
      },
      {
        "FieldName": "Creation date",
        "Value": "2017-09-25T22:42:28-06:00",
        "SystemCode": "CreationDate"
      },
      {
        "FieldName": "Last login date",
        "Value": null,
        "SystemCode": "LastLoginDate"
      },
      {
        "FieldName": "Administrator role",
        "Value": [
          {
            "Id": 256,
            "Label": "Account administrator (Full access)"
          }
        ],
        "SystemCode": "AdminRole"
      },
      {
        "FieldName": "Notes",
        "Value": "",
        "SystemCode": "Notes"
      },
      {
        "FieldName": "Terms of use accepted",
        "Value": true,
        "SystemCode": "SystemRulesAndTermsAccepted"
      },
      {
        "FieldName": "Subscription source",
        "Value": [],
        "SystemCode": "SubscriptionSource"
      },
      {
        "FieldName": "User ID",
        "Value": 41743765,
        "SystemCode": "MemberId"
      },
      {
        "FieldName": "First name",
        "Value": "Troy",
        "SystemCode": "FirstName"
      },
      {
        "FieldName": "Last name",
        "Value": "Ross",
        "SystemCode": "LastName"
      },
      {
        "FieldName": "Organization",
        "Value": "",
        "SystemCode": "Organization"
      },
      {
        "FieldName": "Email",
        "Value": "kak.bo.che@gmail.com",
        "SystemCode": "Email"
      },
      {
        "FieldName": "Phone",
        "Value": "505-349-3552",
        "SystemCode": "Phone"
      },
      {
        "FieldName": "Avatar",
        "Value": {
          "Id": "cykvn30z.png",
          "Url": "https://api.wildapricot.org/v2.1/accounts/240904/Pictures/cykvn30z.png"
        },
        "SystemCode": "custom-9399423"
      },
      {
        "FieldName": "RFID",
        "Value": "3250732",
        "SystemCode": "custom-9399436"
      },
      {
        "FieldName": "Member role",
        "Value": null,
        "SystemCode": "MemberRole"
      },
      {
        "FieldName": "Member since",
        "Value": "2017-09-26T15:57:26-06:00",
        "SystemCode": "MemberSince"
      },
      {
        "FieldName": "Renewal due",
        "Value": "2017-10-01T00:00:00",
        "SystemCode": "RenewalDue"
      },
      {
        "FieldName": "Membership level ID",
        "Value": 902677,
        "SystemCode": "MembershipLevelId"
      },
      {
        "FieldName": "Access to profile by others",
        "Value": true,
        "SystemCode": "AccessToProfileByOthers"
      },
      {
        "FieldName": "Renewal date last changed",
        "Value": "2017-09-26T21:57:26-06:00",
        "SystemCode": "RenewalDateLastChanged"
      },
      {
        "FieldName": "Level last changed",
        "Value": "2017-09-26T21:57:26-06:00",
        "SystemCode": "LevelLastChanged"
      },
      {
        "FieldName": "Bundle ID",
        "Value": null,
        "SystemCode": "BundleId"
      },
      {
        "FieldName": "Membership status",
        "Value": {
          "Id": 1,
          "Label": "Active",
          "Value": "Active",
          "SelectedByDefault": false,
          "Position": 0
        },
        "SystemCode": "Status"
      },
      {
        "FieldName": "Membership enabled",
        "Value": true,
        "SystemCode": "MembershipEnabled"
      },
      {
        "FieldName": "Group participation",
        "Value": [],
        "SystemCode": "Groups"
      }
    ],
    "Id": 41743765,
    "Url": "https://api.wildapricot.org/v2.1/accounts/240904/Contacts/41743765",
    "IsAccountAdministrator": true,
    "TermsOfUseAccepted": true,
    "avatar": {
      "cykvn30z.png": "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"
    }
  }


export default Contacts;