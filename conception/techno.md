# Docker
Le front et le back seront dockerisés pour permettre à l'ensemble des développeurs de travailler sur le même environnement.

# Front

- ###  React version 18 
Framework front en JavaScript connu de tous les développeurs. React permet de créer des composants réutilisables.

- ###  React Router
On utilise react router pour gérer les routes de l'application, react router est maintenu assez régulièrement et téléchargé beaucoup de fois, c'est un librairie sûr de router.

- ###  Vite
Outil de développment pour un serveur rapide et un build optimisé pour la production, il a l'avantage. Vite est utilisé dans énormément de projets grâce à sa rapidité et son efficacité.
Il a une simplicité de configuration et une rapidité d'exécution. Il a une communauté croissante et dispose d'une très bonne documentation.

- ###  Tailwind
Une des plus importantes librairies CSS, elle permet de créer des classes prédéfinis pour les styles. En plus de nous faire gagner du temps, elle permet de partager une documentation de class
à toute l'équipe front.

- ###  ShadcnUi
Pour gagner du temps sur les composants, ce sont des composants bien pensés et va permettre aussi d'harmoniser toute application. Elle offre une bonne documentation accesible à toute l'équipe.

- ### Dayjs
Une des librairies JS les plus utilisées, elle permet de gérer les dates facilement. Indispensable vu la complexité des dates dans le monde réel.

- ###  TypeScript
Pour aider les développeurs à écrire du code sécurisé, Typescript va nous permettre de typer les classes, les variables, etc.

- ### Vitest
Pour effectuer nos tests, on a choisi vitest qui est une librairie JS très simple à utiliser et qui permet de faire des tests unitaires. Elle est très bien documenté, connu de tous 
les développeurs de l'équipe. 

# Back

- ### PostgreSQL
Base de données relationnelle, PostgreSQL est connu par tous les dévoloppeurs et chacun le maitrise.

- ### Adminer
Adminer pour gérér et visualiser graphiquement la base de données. Elle est très bien documentée et connue de tous les développeurs de l'équipe.

- ### Nginx
On avait ce besoin de sécuriser l'entrée des joueurs et de sécuriser les routes de notre API. Nginx est un serveur web très performant et connu de tous les développeurs de l'équipe.

- ### Node.js
On utilise javascript, node permet de nous créer notre serveur web api. Il est très performant et connu de tous les développeurs de l'équipe.

- ### Redis
Redis est un système de gestion de base de données en mémoire, clé-valeur, rapide et polyvalent, utilisé pour le stockage de données temporaires et le caching. On avait besoin de ça pour anticiper
la demande massive de joueurs sur le classement par exemple. Redis va nous permettre de stocker des données en mémoire, ce qui va nous permettre de répondre rapidement aux demandes et d'éviter des couts 
de demande en base de données.

- ###  Prisma
ORM qui facilite l'interaction avec la base de données, on a choisi Prisma car elle est très simple à utiliser et très bien documentée. Elle est connue de tous les développeurs de l'équipe.
Prisma a une très bonne sécurisation des requetes sql en plus de les optimiser.

- ###  Express
Express connu par tous les développeurs de notre équipe. Il va nous simplifier la vie pour la créeation et la gestion du serveur node.

- ###  GoogleApiAuth
Permet de s'authentifier avec Google, on avait ce besoin car on force le joueur à s'inscire et à se connecter pour jouer. Google Api Auth va permettre au joueur de s'identifier rapidemetent et facilement.

- ### bcryptJsL
Le hashage d'un mot de passe est compliqué à faire soi même. On utilise l'algorithme de bcrypt pour haser les mots de passe avant de les envoyer en base de données.

- ### JWT
Idem que pour bcryptJs, le token est un moyen de sécuriser les routes en créant des tokens sécurisés. JWT est le plus simple à utiliser, connu de tous les développeurs de l'équipe.

- ### Jest
Jest test nos routes avant le déploiement. Il est connu de tous les développeurs de l'équipe et très bien documenté. C'est un outil très utilisé par les développeurs de l'équipe.

- ###  Graphql
Graphql va nous permettre de faire des requêtes très simples et très rapides sur nos API.
On avait ce besoin de permettre aux developpeurs front de prendre les données qu'ils ont besoins et de les faire des requêtes très rapides.

- ###  TypeScript
Pour aider les développeurs à écrire du code sécurisé, Typescript va nous permettre de typer les classes, les variables, etc.
