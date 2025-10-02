# Hero Section Layout DSL

# Nodes
tagline tagline-0 at (450, 50)
codeBlock codeBlock-0 at (165.55189456342669, 244.92751235584842)
command command-0 at (534.1466227347612, 149.1532125205931)
feature feature-0 at (1000, 254.44481054365735)
feature feature-1 at (1001.148270181219, 365.9275123558484)
feature feature-2 at (1001.148270181219, 467.07578253706754)
feature feature-3 at (1000, 551)
feature feature-4 at (1000, 651)

# Connections
# Syntax: connect sourceId -> targetId [fromHandle] [toHandle]
# Example: connect codeBlock-0 -> command-0 bottom left
connect command-0 -> feature-0 right left
connect command-0 -> feature-1 right left
connect command-0 -> feature-2 right left
connect command-0 -> feature-3 right left
connect command-0 -> feature-4 right left
connect codeBlock-0 -> feature-0 right left
connect codeBlock-0 -> feature-1 right left
connect codeBlock-0 -> feature-2 right left
connect codeBlock-0 -> feature-3 right left
connect codeBlock-0 -> feature-4 right left

# To remove a connection, delete the line above
# To add a connection, add a new line with: connect sourceId -> targetId [fromHandle] [toHandle]