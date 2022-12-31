import webbrowser
import datetime
import os, sys
import time
from tqdm.auto import tqdm

def cleaning():
    if sys.platform.startswith('win'):
        os.system('cls')
    elif sys.platform.startswith('darwin'):
        os.system('clear')
    elif sys.platform.startswith('linux'):
        os.system('clear')


def main():
    startBara()
    print("PROGRAMA QUE PONE '5 PARA LAS DOCE' CUANDO FALTEN  5 PA LAS DOCE ")
    control = 1
    while control == 1:
        time.sleep(0.5)
        reloj = hora()
        
        control = yaEs(reloj)
    
    print("Momento de llamar a mi ex... <3")

def startBara():
    for i in tqdm(range(10001)):
        print(" " , end='\r')
    

def hora():
    horaActual =datetime.datetime.now()
    horas = int(horaActual.hour)
    minutos = int(horaActual.minute)
    segundos = int(horaActual.second)

    return([horas,minutos,segundos])

def yaEs(hora):
    if hora[0] == 23 and hora[1] == 55:
        webbrowser.open("https://youtu.be/RgbFLWG5wOI")
        return(0)
    else:
        return(1)

main()

    