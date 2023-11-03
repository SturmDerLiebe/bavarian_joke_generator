# Database Model
## Bavarian joke Simulator
### Minimum Features:
- A user can search for *any* Bavarian jokes by submitting *one* English keyword
- A user can submit a Bavarian joke alongside _at least one_, related keywords
- A Bavarian joke is accompanied by its explanation in English
- A user can submit a joke without logging in
### Additional Features:
- Searching via keyword suggests an existing keyword dropdown
- A user can sign up alongside submitting a joke
- A user can log in to submit and view, edit & delete their submissions
- A user can log in via a webatuhn authenticator
- Users can register _multiple_ authenticators (e.g. Phone, Yubikey, etc.)
<hr style="page-break-after: always"/>

#### Conceptual Model
@startuml
'skinparam linetype ortho
scale 2
!theme vibrant

entity joke
entity keyword
entity user
entity authenticator

joke }|--|{ keyword : is associated with >
joke }|--o| user : can be submitted by >
user ||--|{ authenticator : loggs in via >

@enduml

<hr style="page-break-after: always" >

#### Physical Model
@startuml
'skinparam linetype ortho
scale 2
!theme vibrant

entity joke {
    * id: SERIAL <<PK>>
    --
    * content: TEXT
    * explanation: TEXT
    submitted_by: BIGINT UNSIGNED <<FK>>
}

entity jk_pair {
    * joke_id: BIGINT UNSIGNED <<PK>> <<FK>>
    * keyword_title: VARCHAR(30) <<PK>> <<FK>>
    --
}

entity Keyword  {
    * title: VARCHAR(30) <<PK>>
    --
}

entity user {
    ' The extra id is necessary for using simplewebauthn:
    * id: SERIAL <<PK>>
    --
    * username VARCHAR(30) UNIQUE <<SK>>
    current_challange: TINYTEXT
}

entity authenticator {
    * id: SERIAL <<PK>>
    --
    * credentialID: TEXT
    * credentialPublicKey: BLOB
    * counter: BIGINT UNSIGNED
    * credentialDeviceType: ENUM('singleDevice', 'multiDevice')
    * credentialBackedUp: BOOL
    transports: SET('ble', 'cable', 'hybrid', 'internal', 'nfc', 'smart-card', 'usb')
    * user_id: BIGINT UNSIGNED <<FK>>
}

joke ||--|{ jk_pair : has >
jk_pair }|--|| Keyword : is part of <
joke }|--o| user : can submitted by >
user ||--|{ authenticator : logs in via > 

legend
    Attributes with a • (list marker) have the NOT NULL constraint
    Attributes without a • (list marker) have the DEFAULT NULL
endlegend
@enduml
