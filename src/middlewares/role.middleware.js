let grantList = [
    {role: "admin", resource:"user", action: "create:any", attributes: "*"},
    {role: "admin", resource:"user", action: "update:any", attributes: "*"},
    {role: "admin", resource:"user", action: "delete:any", attributes: "*"},
    {role: "admin", resource:"recipe", action: "update:any", attributes: "*"},
    {role: "admin", resource:"recipe", action: "delete:any", attributes: "*"},
    //
    {role: "user", resource:"user", action: "update:own", attributes: "email, user_name"},
    {role: "user", resource:"recipe", action: "create:own", attributes: "*, !is_draft, !is_published"},
]