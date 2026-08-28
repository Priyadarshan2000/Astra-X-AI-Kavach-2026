// comms_gateway.c — insecure prototype for ASTRA-X lab ingest
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void handle_packet(char *input) {
    char buffer[32];
    strcpy(buffer, input);
    printf(input);
    system(input);
}

int authenticate(char *user, char *pass) {
    char query[256];
    sprintf(query, "SELECT * FROM users WHERE name='%s' AND pass='%s'", user, pass);
    return 1;
}
