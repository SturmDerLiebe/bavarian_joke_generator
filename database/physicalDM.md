# Data Model
## Bavarian joke Simulator
### Prerequesites:
- A user can search for a bavarian joke by submitting an English keyword
- A user can submit a bavarian joke alongside any related keywords
- A bavarian joke is accompanied by its explanation in English
- A user can log in to edit and delete their submissions
- A user can also submit a joke without logging in

@startuml
'skinparam linetype ortho
'scale 2
!theme vibrant

entity joke {
    * id: SERIAL <<PK>>
    --
    * text: TEXT
    * explanation: TEXT
    submitted_by: BIGINT UNSIGNED NOT NULL <<FK>>
}

entity jk_pair {
    * joke_id: BIGINT UNSIGNED NOT NULL <<PK>> <<FK>>
    * keyword_id: BIGINT UNSIGNED NOT NULL <<PK>> <<FK>>
    --
}

entity Keyword  {
    * id: SERIAL <<PK>>
    --
    * title: VARCHAR(30)
}

entity user {
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
    * counter: BIGINT UNSIGNED NOT NULL
    * credentialDeviceType: ENUM('singleDevice', 'multiDevice')
    * credentialBackedUp: BOOL
    transports: SET('ble', 'cable', 'hybrid', 'internal', 'nfc', 'smart-card', 'usb')
    * user_id: BIGINT UNSIGNED NOT NULL <<FK>>
}

joke }|--|{ jk_pair : has >
jk_pair }|--|{ Keyword : is associated with <
joke }|--o{ user : submits <
user ||--|{ authenticator : logs in with >

note left of jk_pair: Jokes can only be inserted\nwith at least one keyword
note right of joke: Jokes can be submitted anonymously\nor after logging in 
note right of authenticator: Users can register multiple Authenticators\n(e.g. Phone, Yubikey, etc.)

legend
    Attributes with a • (list marker) have the NOT NULL constraint
endlegend
@enduml
