# Dovecot en Postfix: maximale mailgrootte

Ik gebruik rainloop als webmail programma. Maar kreeg bij versturen van een paar attachments een nogal vage foutmelding. Ik kan me iets herinneren dat standaard is ingesteld op 10MB. Dacht 'dat verhoog ik wel even'. Niet dus. Omdat het alweer even geleden is dat ik dit had opgezet, verdwaalde ik in de configs voor Postfix en Dovecot. 

In `/etc/postfix/main.cf` word de limietwaarde gezet met:

```ini
message_size_limit = 20971520
```

Dat is de maximale berichtgrootte in bytes (20 MB). Dovecot zelf heeft ook nog max waardes, dat zijn waardes voor mailboxquota. Voor individuele berichten is Postfix de plek om het in te stellen.

Was even zoeken, maar nu weer teruggevonden.

