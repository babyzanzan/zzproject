CREATE TABLE [dbo].[ElUser](
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[LoginId] [nvarchar](50) NOT NULL,
	[Passwrod] [nvarchar](100) NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Avatar] [nvarchar](200) NOT NULL,
	[Enabled] [bit] NOT NULL,
	[OwnerId] [int] NOT NULL
)

CREATE TABLE [dbo].[ClientCardTypes](
	[CardTypeID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[CardTypeName] [nvarchar](100) NULL
)

CREATE TABLE [dbo].[ElMenu](
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[path] [nvarchar](100) NOT NULL,
	[component] [text] NOT NULL,
	[redirect] [nvarchar](100) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[meta] [nvarchar](100) NOT NULL,
	[children] [text] NOT NULL,
	[active] [bit] NOT NULL
)

CREATE TABLE [dbo].[ElUserMenu](
	[UserId] [int] NOT NULL,
	[MenuId] [int] NOT NULL
)

CREATE TABLE [dbo].[Products](
	[PID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[OwnerID] [int] NOT NULL,
	[ProductTypeID] [int] NULL,
	[PCode] [nvarchar](50) NULL,
	[BarCode] [nvarchar](50) NULL,
	[ProductName] [nvarchar](100) NULL,
	[UnitType] [nvarchar](30) NULL,
	[FromPlace] [nvarchar](200) NULL
)

CREATE TABLE [dbo].[DIYtable](
	[templateID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[databaseSource] [nvarchar](50) NOT NULL,
	[editColumn] [bit] NOT NULL,
	[menuClass] [nvarchar](500) NOT NULL,
	[optionList] [nvarchar](300) NULL,
	[sqlLanguage] [nvarchar](100) NOT NULL,
	[columList] [text] NOT NULL,
	[templateName] [nvarchar](50) NOT NULL,
	[useTips] [nvarchar](200) NULL
)
