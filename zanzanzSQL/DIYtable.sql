USE [Bz3PL]
GO

/****** Object:  Table [dbo].[DIYtable]    Script Date: 2023/9/28 16:18:18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DIYtable](
	[templateID] [int] IDENTITY(1,1) NOT NULL,
	[databaseSource] [varchar](50) NOT NULL,
	[editColumn] [bit] NOT NULL,
	[menuClass] [varchar](500) NOT NULL,
	[optionList] [varchar](300) NULL,
	[sqlLanguage] [varchar](100) NOT NULL,
	[columList] [text] NOT NULL,
	[templateName] [varchar](50) NOT NULL,
	[useTips] [varchar](200) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


