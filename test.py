import os

commands = []

for item in list(os.walk("output"))[0][2]:
    commands.append(
        f'convert output/{item} -transparent "#ffffff" newoutput/{item}'
    )

with open("run.sh",'w') as file:
    file.write("\n\n".join(commands))