# BEIS NSI Initial Due Diligence (IDD) Portal

The National Security and Investment Act (NSI) came into force on 4 January 2022.

The Act gives the government powers to scrutinise and intervene in business transactions, such as takeovers, to protect national security, while providing businesses and investors with the certainty and transparency they need to do business in the UK.

The Initial Due Diligence (IDD) portal allows BEIS ISU team to:

- view open notifications that are submitted from the BEIS NSI notification portal
- view in-progress notifications that the notifiers are currently workion on
- view notifications claimed by the signed team member
- view notifications that have been accepted from the IDD portal
- view notifications that have been rejected from the IDD portal
- view notifications that have been passed back to the notifier requesting more information

BEIS ISU team may need to do this if they:

- want to review a submitted notification and approve it
- want to review a submitted notification and reject it
- want to review a submitted notification and request more information regarding the notification
- want to see the notifications for which the decision is pending

## Setup

Run the setup command from the application directory. This installs any node
dependencies (packages), and builds the assets:

```
npm install
```

You will need to configure the Azure B2B access seperately see the nsi-azure-b2b repository.

This portal also requires a Postgres database, the creation scripts for the the container for this can be found and the AppNotes.txt file within the project.  Here is a sample script for creating the basic Postgres Docker container:

```
docker run -d --name beisnpdb-postgres -e POSTGRES_PASSWORD=Pass2020! -v C:/Dev/beisnpdb-data/:/var/lib/postgresql/data -p 5490:5432 postgres
```

## Running the application

To run the application, from the application directory, run:

```
npm start
```

This runs the application on `localhost:3001`.


## Access

### Staging

The staging environment is hosted on Azure: https://nsi-admin-stg.beis.gov.uk/

### Production

The production environment is hosted on Azure: https://nsi-admin.beis.gov.uk/
