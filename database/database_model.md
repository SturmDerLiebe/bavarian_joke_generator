# Database Model
## Bavarian joke Simulator
### Implemented Use Cases:
- A user can search for *any* Bavarian jokes by submitting *one* English keyword
- A user can submit a Bavarian joke alongside _at least one_, related keyword
- A Bavarian joke is accompanied by its required explanation in English
- A user can submit a joke anonymously without logging in
    - These jokes can not be edited afterwards by them
- A user can sign up & log in  via webauthn (without a password)
    - webauthn needs one current challange for a user to be solved by on of the users registered authenticators (i.e. private key)
- Authenticating/Logging in is possible via submitting a joke
### Use Cases to be implemented:
- A user can log in to submit jokes and view, edit & delete their submissions
    - On joke deletion, the joke-keyword pair gets deleted as well
    - Changing the assoiated keyword adds a new keyword if it does not exist yet and associates the joke with the new keyword(s)
- A loggeed in user can register _multiple_ webauthn authenticators (e.g. Phone, Yubikey, etc.)
- A logged in user can change their username, if the new one does not exist yet
- A user can search for a Joke by a fuzzy/full-text-search
- Jokes that already exist should not be submittable
- Jokes that are too similar should also not be submittable
- A user is shown an existing keyword dropdown of most searched keywords, when searching via keyword
- An Admin can delete keywords, on which the associated joke-keyword pairs get deleted
    - If any joke ends up with no joke-keyword pairs through this, it should still be requestable by the "Other"-keyword
- An Admin can edit keywords
<hr style="page-break-after: always"/>

#### Conceptual Model
@startuml
'skinparam linetype ortho
scale 2
!theme vibrant

entity joke
entity keyword
entity users
entity authenticator

joke }|--|{ keyword : is associated with >
joke }o--o| users : can be submitted by >
users ||--|{ authenticator : loggs in via >

@enduml

<hr style="page-break-after: always" >

#### Physical Model (implemented)
@startuml
'skinparam linetype ortho
scale 2
!theme vibrant

entity joke {
    * id: SERIAL <<PK>>
    --
    * content: TEXT <<SK>>
    * explanation: TEXT
    submitted_by: BIGINT UNSIGNED <<FK>>
}

entity jk_pair {
    * joke_id: BIGINT UNSIGNED <<PK>> <<FK>>
    * keyword_id: BIGINT UNSIGNED <<PK>>> <<FK>>
    --
}

entity Keyword  {
    ' use id instead of title as PK for performance and easier editing of keywords
    * id: SERIAL <<PK>>
    --
    * title: VARCHAR(30) <<SK>>
    searched_times: BIGINT UNSIGNED
}

entity users {
    ' The extra id is necessary for using simplewebauthn:
    * id: SERIAL <<PK>>
    --
    * username VARCHAR(30) <<SK>>
    current_challange: TEXT
}

entity authenticator {
    * id: SERIAL <<PK>>
    --
    * credential_id: TEXT |I|
    * credential_public_key: BLOB
    * counter: BIGINT UNSIGNED DEFAULT 0
    * credential_device_type: VARCHAR(32)
    * credential_backed_up: BOOL
    transports: VARCHAR(255)
    * user_id: BIGINT UNSIGNED <<FK>>
}

joke ||--|{ jk_pair : has >
jk_pair }|--|| Keyword : is part of <
joke }o--o| users : can submitted by >
users ||--|{ authenticator : logs in via > 

legend
    Attributes with a • (list marker) have the NOT NULL constraint.
    Attributes without a • (list marker) have the DEFAULT NULL unless specified otherwise.
    Attributes with <<SK>> have an UNIQUE Index.
    Attributes with |I| are indexed as well.
endlegend
@enduml
